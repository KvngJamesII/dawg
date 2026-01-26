import express from 'express';
import {
  getAllUsers,
  addCreditsToUser,
  toggleUserBan,
  deleteUser,
  getAdminStats,
  getSettings,
  updateSettings,
  verifyToken
} from '../services/userService.js';

const router = express.Router();

// Admin auth middleware (checks JWT token and isAdmin)
function adminAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }

    if (!decoded.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    req.userId = decoded.id;
    req.isAdmin = decoded.isAdmin;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Authentication failed'
    });
  }
}

// Apply admin auth to all routes
router.use(adminAuth);

// Get admin dashboard data
router.get('/dashboard', (req, res) => {
  try {
    const stats = getAdminStats();
    const users = getAllUsers();
    const recentUsers = users
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    res.json({
      success: true,
      stats,
      recentUsers,
      systemStatus: {
        api: true,
        database: true,
        tiktok: true,
        youtube: true
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all users
router.get('/users', (req, res) => {
  try {
    const users = getAllUsers();
    
    res.json({
      success: true,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Add credits to user
router.post('/users/:userId/credits', (req, res) => {
  try {
    const { userId } = req.params;
    const { amount } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({
        success: false,
        error: 'Valid credit amount required'
      });
    }

    const newBalance = addCreditsToUser(userId, parseInt(amount));
    
    res.json({
      success: true,
      message: `Added ${amount} credits`,
      newBalance
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Toggle user ban
router.post('/users/:userId/toggle-ban', (req, res) => {
  try {
    const { userId } = req.params;
    const banned = toggleUserBan(userId);
    
    res.json({
      success: true,
      banned
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Delete user
router.delete('/users/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    deleteUser(userId);
    
    res.json({
      success: true,
      message: 'User deleted'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get settings (combined with existing settings)
router.get('/settings', (req, res) => {
  try {
    const settings = getSettings();
    
    res.json({
      success: true,
      settings: {
        ...settings,
        requireApiKey: process.env.REQUIRE_API_KEY === 'true',
        maintenanceMode: false
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update settings
router.put('/settings', (req, res) => {
  try {
    const { freeCredits, creditCost, maintenanceMode } = req.body;
    
    const updates = {};
    if (freeCredits !== undefined) updates.freeCredits = parseInt(freeCredits);
    if (creditCost !== undefined) updates.creditCost = parseInt(creditCost);
    if (maintenanceMode !== undefined) updates.maintenanceMode = maintenanceMode;

    const settings = updateSettings(updates);
    
    res.json({
      success: true,
      settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
