import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const USERS_FILE = join(__dirname, '..', 'database', 'users.json');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper to read users
function readUsers() {
  if (!existsSync(USERS_FILE)) {
    writeFileSync(USERS_FILE, JSON.stringify({ users: [] }, null, 2));
    return [];
  }
  const data = JSON.parse(readFileSync(USERS_FILE, 'utf8'));
  return data.users || [];
}

// Helper to write users
function writeUsers(users) {
  writeFileSync(USERS_FILE, JSON.stringify({ users }, null, 2));
}

// Generate Google OAuth URL
export function getGoogleAuthUrl() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'https://api.idledeveloper.tech/api/auth/google/callback';
  
  if (!clientId) {
    throw new Error('Google Client ID not configured');
  }

  const scope = encodeURIComponent('email profile');
  const state = crypto.randomBytes(16).toString('hex');
  
  const url = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=${scope}` +
    `&state=${state}` +
    `&access_type=offline` +
    `&prompt=consent`;

  return { url, state };
}

// Exchange code for tokens
export async function exchangeCodeForTokens(code) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'https://api.idledeveloper.tech/api/auth/google/callback';

  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth not configured');
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to exchange code: ${error}`);
  }

  return response.json();
}

// Get user info from Google
export async function getGoogleUserInfo(accessToken) {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get user info from Google');
  }

  return response.json();
}

// Find or create user from Google data
export function findOrCreateGoogleUser(googleUser) {
  const users = readUsers();
  
  // Check if user exists by Google ID or email
  let user = users.find(u => u.googleId === googleUser.id || u.email === googleUser.email);
  
  if (user) {
    // Update Google ID if not set (user registered with email first)
    if (!user.googleId) {
      user.googleId = googleUser.id;
      user.avatar = googleUser.picture;
      writeUsers(users);
    }
  } else {
    // Create new user
    user = {
      id: crypto.randomUUID(),
      googleId: googleUser.id,
      name: googleUser.name,
      email: googleUser.email,
      avatar: googleUser.picture,
      password: null, // No password for Google users
      credits: 25, // Free credits
      isAdmin: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    users.push(user);
    writeUsers(users);
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email, isAdmin: user.isAdmin },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Return user without sensitive data
  const { password, ...safeUser } = user;
  return { user: safeUser, token };
}

// Handle the full Google OAuth callback
export async function handleGoogleCallback(code) {
  // Exchange code for tokens
  const tokens = await exchangeCodeForTokens(code);
  
  // Get user info
  const googleUser = await getGoogleUserInfo(tokens.access_token);
  
  // Find or create user
  const result = findOrCreateGoogleUser(googleUser);
  
  return result;
}
