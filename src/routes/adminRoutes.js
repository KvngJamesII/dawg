import { Router } from 'express';
import { tokenService } from '../services/tokenService.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();

// Admin secret key (set in .env for production)
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'supersecret_change_this_in_production';

// Runtime settings (can be changed without restart)
// Note: initialized lazily on first access since env vars may not be loaded at import time
let runtimeSettings = null;

function getSettings() {
  if (runtimeSettings === null) {
    runtimeSettings = {
      requireApiKey: process.env.REQUIRE_API_KEY === 'true'
    };
  }
  return runtimeSettings;
}

// Export function to check if API key is required
export function isApiKeyRequired() {
  return getSettings().requireApiKey;
}

// Admin authentication middleware
function adminAuth(req, res, next) {
  const adminKey = req.headers['x-admin-key'] || req.query.admin_key;
  
  if (!adminKey || adminKey !== ADMIN_SECRET) {
    return res.status(403).json({
      success: false,
      error: 'Admin access required'
    });
  }
  
  next();
}

// Apply admin auth to all routes
router.use(adminAuth);

/**
 * POST /api/admin/tokens
 * Create a new API token
 */
router.post('/tokens', (req, res) => {
  try {
    const { name, dailyLimit = 100, totalLimit = 10000, allowedEndpoints = [] } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Name is required'
      });
    }

    const token = tokenService.createToken({
      name,
      dailyLimit: parseInt(dailyLimit) || 100,
      totalLimit: parseInt(totalLimit) || 10000,
      allowedEndpoints
    });

    res.status(201).json({
      success: true,
      message: 'API token created successfully',
      token: {
        token: token.token,
        name: token.name,
        dailyLimit: token.dailyLimit,
        totalLimit: token.totalLimit,
        createdAt: token.createdAt
      },
      warning: 'Save this token securely - it cannot be retrieved later!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/admin/tokens
 * List all API tokens
 */
router.get('/tokens', (req, res) => {
  try {
    const tokens = tokenService.listTokens();
    
    res.json({
      success: true,
      count: tokens.length,
      tokens: tokens
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/admin/tokens/:token
 * Get specific token info (use full token)
 */
router.get('/tokens/:token', (req, res) => {
  try {
    const tokenInfo = tokenService.getTokenInfo(decodeURIComponent(req.params.token));
    
    if (!tokenInfo) {
      return res.status(404).json({
        success: false,
        error: 'Token not found'
      });
    }

    res.json({
      success: true,
      data: {
        name: tokenInfo.name,
        token: tokenInfo.token.substring(0, 15) + '***',
        dailyLimit: tokenInfo.dailyLimit,
        totalLimit: tokenInfo.totalLimit,
        usage: tokenInfo.usage,
        active: tokenInfo.active,
        createdAt: tokenInfo.createdAt,
        lastUsedAt: tokenInfo.lastUsedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/admin/stats
 * Get overall API statistics
 */
router.get('/stats', (req, res) => {
  try {
    const tokens = tokenService.listTokens();
    
    const stats = {
      totalTokens: tokens.length,
      activeTokens: tokens.filter(t => t.active).length,
      inactiveTokens: tokens.filter(t => !t.active).length,
      totalUsage: tokens.reduce((sum, t) => sum + (t.usage?.total || 0), 0),
      totalDailyUsage: tokens.reduce((sum, t) => sum + (t.usage?.daily || 0), 0)
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PATCH /api/admin/tokens/:token
 * Update token settings
 */
router.patch('/tokens/:token', (req, res) => {
  try {
    const { name, dailyLimit, totalLimit, active } = req.body;
    
    const updated = tokenService.updateToken(decodeURIComponent(req.params.token), {
      name,
      dailyLimit: dailyLimit !== undefined ? parseInt(dailyLimit) : undefined,
      totalLimit: totalLimit !== undefined ? parseInt(totalLimit) : undefined,
      active
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Token not found'
      });
    }

    res.json({
      success: true,
      message: 'Token updated',
      data: {
        name: updated.name,
        dailyLimit: updated.dailyLimit,
        totalLimit: updated.totalLimit,
        active: updated.active
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/admin/tokens/:token
 * Update token settings (alias for PATCH)
 */
router.put('/tokens/:token', (req, res) => {
  try {
    const { name, dailyLimit, totalLimit, active } = req.body;
    
    const updated = tokenService.updateToken(decodeURIComponent(req.params.token), {
      name,
      dailyLimit: dailyLimit !== undefined ? parseInt(dailyLimit) : undefined,
      totalLimit: totalLimit !== undefined ? parseInt(totalLimit) : undefined,
      active
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Token not found'
      });
    }

    res.json({
      success: true,
      message: 'Token updated',
      data: {
        name: updated.name,
        dailyLimit: updated.dailyLimit,
        totalLimit: updated.totalLimit,
        active: updated.active
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/admin/tokens/:token/reset
 * Reset token usage
 */
router.post('/tokens/:token/reset', (req, res) => {
  try {
    const { resetTotal = false } = req.body;
    
    const success = tokenService.resetUsage(decodeURIComponent(req.params.token), resetTotal);

    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Token not found'
      });
    }

    res.json({
      success: true,
      message: resetTotal ? 'Daily and total usage reset' : 'Daily usage reset'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/admin/tokens/:token
 * Delete a token
 */
router.delete('/tokens/:token', (req, res) => {
  try {
    const success = tokenService.deleteToken(decodeURIComponent(req.params.token));

    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Token not found'
      });
    }

    res.json({
      success: true,
      message: 'Token deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/admin/settings
 * Get current API settings
 */
router.get('/settings', (req, res) => {
  res.json({
    success: true,
    settings: {
      requireApiKey: getSettings().requireApiKey,
      rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 20,
      rateLimitWindowMinutes: (parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000) / 60000
    }
  });
});

/**
 * PUT /api/admin/settings
 * Update API settings
 */
router.put('/settings', (req, res) => {
  try {
    const { requireApiKey } = req.body;
    
    if (typeof requireApiKey === 'boolean') {
      getSettings().requireApiKey = requireApiKey;
    }
    
    res.json({
      success: true,
      message: 'Settings updated',
      settings: getSettings()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
