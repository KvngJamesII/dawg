import express from 'express';
import {
  registerUser,
  loginUser,
  getUserById,
  verifyToken
} from '../services/userService.js';
import {
  getGoogleAuthUrl,
  handleGoogleCallback
} from '../services/googleAuthService.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters'
      });
    }

    const result = await registerUser(name, email, password);
    
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: result.user,
      token: result.token
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    const result = await loginUser(email, password);
    
    res.json({
      success: true,
      user: result.user,
      token: result.token
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error.message
    });
  }
});

// Get current user
router.get('/me', async (req, res) => {
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

    const user = getUserById(decoded.id);
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

// Google OAuth - Initiate
router.get('/google', (req, res) => {
  try {
    const { url } = getGoogleAuthUrl();
    res.redirect(url);
  } catch (error) {
    // If Google OAuth is not configured, redirect with error
    const frontendUrl = process.env.FRONTEND_URL || '';
    res.redirect(`${frontendUrl}/login?error=${encodeURIComponent('Google login is not configured. Please contact support.')}`);
  }
});

// Google OAuth - Callback
router.get('/google/callback', async (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || '';
  
  try {
    const { code, error } = req.query;

    if (error) {
      return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent('Google login was cancelled')}`);
    }

    if (!code) {
      return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent('No authorization code received')}`);
    }

    const result = await handleGoogleCallback(code);
    
    // Redirect to frontend with token
    res.redirect(`${frontendUrl}/auth/callback?token=${result.token}`);
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.redirect(`${frontendUrl}/login?error=${encodeURIComponent('Failed to authenticate with Google')}`);
  }
});

export default router;
