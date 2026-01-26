import express from 'express';
import {
  getUserById,
  updateUserProfile,
  changePassword,
  generateUserApiKey,
  getUserStats,
  deleteUser,
  verifyToken
} from '../services/userService.js';

const router = express.Router();

// Auth middleware for user routes
function userAuth(req, res, next) {
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

    req.userId = decoded.id;
    req.userEmail = decoded.email;
    req.isAdmin = decoded.isAdmin;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Authentication failed'
    });
  }
}

// Apply auth middleware to all routes
router.use(userAuth);

// Get user profile
router.get('/profile', (req, res) => {
  try {
    const user = getUserById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update profile
router.put('/profile', (req, res) => {
  try {
    const { name, email } = req.body;
    const user = updateUserProfile(req.userId, { name, email });
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Change password
router.put('/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 6 characters'
      });
    }

    await changePassword(req.userId, currentPassword, newPassword);
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get user stats
router.get('/stats', (req, res) => {
  try {
    const stats = getUserStats(req.userId);
    
    res.json({
      success: true,
      stats,
      recentActivity: [] // Would need request logging to populate this
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get usage data
router.get('/usage', (req, res) => {
  try {
    const user = getUserById(req.userId);
    
    // Placeholder - would need actual request logging
    res.json({
      success: true,
      stats: {
        totalRequests: user?.totalRequests || 0,
        successRate: 98,
        creditsUsed: user?.totalRequests || 0,
        byService: {
          tiktok: { requests: Math.floor((user?.totalRequests || 0) * 0.6), credits: Math.floor((user?.totalRequests || 0) * 0.6) },
          youtube: { requests: Math.floor((user?.totalRequests || 0) * 0.4), credits: Math.floor((user?.totalRequests || 0) * 0.4) }
        }
      },
      history: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Generate API key
router.post('/api-keys/:service/generate', (req, res) => {
  try {
    const { service } = req.params;
    const apiKey = generateUserApiKey(req.userId, service);
    
    res.json({
      success: true,
      apiKey
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Regenerate API key
router.post('/api-keys/:service/regenerate', (req, res) => {
  try {
    const { service } = req.params;
    const apiKey = generateUserApiKey(req.userId, service);
    
    res.json({
      success: true,
      apiKey
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Delete account
router.delete('/account', async (req, res) => {
  try {
    deleteUser(req.userId);
    
    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
