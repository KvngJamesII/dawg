import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const USERS_FILE = join(__dirname, '..', 'database', 'users.json');

// Default settings
const DEFAULT_FREE_CREDITS = 25;

// Initialize users file if it doesn't exist
function initUsersFile() {
  if (!existsSync(USERS_FILE)) {
    writeFileSync(USERS_FILE, JSON.stringify({ users: [], settings: { freeCredits: DEFAULT_FREE_CREDITS } }, null, 2));
  }
}

// Load users from file
function loadUsers() {
  initUsersFile();
  try {
    const data = readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { users: [], settings: { freeCredits: DEFAULT_FREE_CREDITS } };
  }
}

// Save users to file
function saveUsers(data) {
  writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
}

// Generate API key
function generateApiKey(service) {
  return `${service}_${crypto.randomBytes(24).toString('hex')}`;
}

// Generate JWT token
function generateToken(user) {
  const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
  return jwt.sign(
    { id: user.id, email: user.email, isAdmin: user.isAdmin },
    secret,
    { expiresIn: '7d' }
  );
}

// Verify JWT token
export function verifyToken(token) {
  const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}

// Register new user
export async function registerUser(name, email, password) {
  const data = loadUsers();
  
  // Check if email already exists
  const existingUser = data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    throw new Error('Email already registered');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = {
    id: crypto.randomUUID(),
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    credits: data.settings?.freeCredits || DEFAULT_FREE_CREDITS,
    apiKeys: {
      tiktok: null,
      youtube: null
    },
    isAdmin: data.users.length === 0, // First user is admin
    banned: false,
    totalRequests: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  data.users.push(user);
  saveUsers(data);

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return {
    user: userWithoutPassword,
    token: generateToken(user)
  };
}

// Login user
export async function loginUser(email, password) {
  const data = loadUsers();
  
  const user = data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (user.banned) {
    throw new Error('Account has been suspended');
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Error('Invalid email or password');
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return {
    user: userWithoutPassword,
    token: generateToken(user)
  };
}

// Get user by ID
export function getUserById(userId) {
  const data = loadUsers();
  const user = data.users.find(u => u.id === userId);
  if (!user) return null;
  
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// Get user by API key
export function getUserByApiKey(apiKey) {
  const data = loadUsers();
  
  for (const user of data.users) {
    if (user.apiKeys) {
      if (user.apiKeys.tiktok === apiKey || user.apiKeys.youtube === apiKey) {
        if (user.banned) return null;
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
    }
  }
  return null;
}

// Update user profile
export function updateUserProfile(userId, updates) {
  const data = loadUsers();
  const userIndex = data.users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  // Only allow certain fields to be updated
  const allowedUpdates = ['name', 'email'];
  for (const key of Object.keys(updates)) {
    if (allowedUpdates.includes(key)) {
      if (key === 'email') {
        // Check if email is already taken
        const existingUser = data.users.find(u => u.email.toLowerCase() === updates.email.toLowerCase() && u.id !== userId);
        if (existingUser) {
          throw new Error('Email already in use');
        }
        data.users[userIndex].email = updates.email.toLowerCase();
      } else {
        data.users[userIndex][key] = updates[key];
      }
    }
  }

  data.users[userIndex].updatedAt = new Date().toISOString();
  saveUsers(data);

  const { password: _, ...userWithoutPassword } = data.users[userIndex];
  return userWithoutPassword;
}

// Change password
export async function changePassword(userId, currentPassword, newPassword) {
  const data = loadUsers();
  const userIndex = data.users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  const validPassword = await bcrypt.compare(currentPassword, data.users[userIndex].password);
  if (!validPassword) {
    throw new Error('Current password is incorrect');
  }

  data.users[userIndex].password = await bcrypt.hash(newPassword, 10);
  data.users[userIndex].updatedAt = new Date().toISOString();
  saveUsers(data);

  return true;
}

// Generate/regenerate API key for a service
export function generateUserApiKey(userId, service) {
  const data = loadUsers();
  const userIndex = data.users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  const validServices = ['tiktok', 'youtube'];
  if (!validServices.includes(service)) {
    throw new Error('Invalid service');
  }

  const newKey = generateApiKey(service);
  data.users[userIndex].apiKeys[service] = newKey;
  data.users[userIndex].updatedAt = new Date().toISOString();
  saveUsers(data);

  return newKey;
}

// Deduct credits
export function deductCredits(userId, amount = 1) {
  const data = loadUsers();
  const userIndex = data.users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  if (data.users[userIndex].credits < amount) {
    throw new Error('Insufficient credits');
  }

  data.users[userIndex].credits -= amount;
  data.users[userIndex].totalRequests += 1;
  data.users[userIndex].updatedAt = new Date().toISOString();
  saveUsers(data);

  return data.users[userIndex].credits;
}

// Check if user has enough credits
export function hasCredits(userId, amount = 1) {
  const user = getUserById(userId);
  return user && user.credits >= amount;
}

// Get user stats
export function getUserStats(userId) {
  const user = getUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  return {
    totalRequests: user.totalRequests || 0,
    todayRequests: 0, // Would need request logging to track this
    creditsUsed: (user.isAdmin ? 0 : 25) - user.credits + user.totalRequests // Estimate
  };
}

// ============ ADMIN FUNCTIONS ============

// Get all users (admin only)
export function getAllUsers() {
  const data = loadUsers();
  return data.users.map(user => {
    const { password: _, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      createdAt: new Date(user.createdAt).toLocaleDateString()
    };
  });
}

// Add credits to user (admin only)
export function addCreditsToUser(userId, amount) {
  const data = loadUsers();
  const userIndex = data.users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  data.users[userIndex].credits += amount;
  data.users[userIndex].updatedAt = new Date().toISOString();
  saveUsers(data);

  return data.users[userIndex].credits;
}

// Toggle user ban (admin only)
export function toggleUserBan(userId) {
  const data = loadUsers();
  const userIndex = data.users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  data.users[userIndex].banned = !data.users[userIndex].banned;
  data.users[userIndex].updatedAt = new Date().toISOString();
  saveUsers(data);

  return data.users[userIndex].banned;
}

// Delete user (admin only)
export function deleteUser(userId) {
  const data = loadUsers();
  const userIndex = data.users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  data.users.splice(userIndex, 1);
  saveUsers(data);

  return true;
}

// Get admin dashboard stats
export function getAdminStats() {
  const data = loadUsers();
  const users = data.users;
  
  const today = new Date().toDateString();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  return {
    totalUsers: users.length,
    activeUsers: users.filter(u => new Date(u.updatedAt) > weekAgo).length,
    totalCredits: users.reduce((sum, u) => sum + (u.credits || 0), 0),
    totalRequests: users.reduce((sum, u) => sum + (u.totalRequests || 0), 0),
    todayRequests: 0, // Would need request logging
    todaySignups: users.filter(u => new Date(u.createdAt).toDateString() === today).length
  };
}

// Get settings
export function getSettings() {
  const data = loadUsers();
  return data.settings || { freeCredits: DEFAULT_FREE_CREDITS };
}

// Update settings
export function updateSettings(newSettings) {
  const data = loadUsers();
  data.settings = { ...data.settings, ...newSettings };
  saveUsers(data);
  return data.settings;
}
