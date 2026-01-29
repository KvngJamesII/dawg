import { tokenService } from '../services/tokenService.js';
import { getUserByApiKey, deductCredits } from '../services/userService.js';

/**
 * API Key Authentication Middleware
 * Checks for valid API key in header or query param
 * Supports both admin tokens (sk_live_xxx) and user API keys (tiktok_xxx, youtube_xxx)
 */
export function apiKeyAuth(req, res, next) {
  // Get API key from various sources
  const apiKey = 
    req.headers['x-api-key'] || 
    req.headers['authorization']?.replace('Bearer ', '') ||
    req.query.api_key ||
    req.query.key;  // Also support ?key= for browser URLs

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API key required',
      message: 'Please provide an API key via X-API-Key header, Authorization: Bearer <key>, or ?key= query param'
    });
  }

  // First, check if it's a user API key (tiktok_xxx or youtube_xxx)
  if (apiKey.startsWith('tiktok_') || apiKey.startsWith('youtube_')) {
    const user = getUserByApiKey(apiKey);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid API key',
        remaining: null
      });
    }

    // Check if user has credits
    if (user.credits <= 0) {
      return res.status(429).json({
        success: false,
        error: 'Insufficient credits. Please purchase more credits.',
        remaining: 0
      });
    }

    // Attach user info to request
    req.apiUser = user;
    req.apiRemaining = {
      credits: user.credits
    };

    // Deduct credits after successful response
    res.on('finish', () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          deductCredits(user.id, 1);
        } catch (err) {
          console.error('Failed to deduct credits:', err);
        }
      }
    });

    // Add rate limit headers
    res.setHeader('X-RateLimit-Remaining-Credits', user.credits);

    return next();
  }

  // Otherwise, check if it's an admin token (sk_live_xxx)
  const validation = tokenService.validateToken(apiKey);

  if (!validation.valid) {
    return res.status(validation.error.includes('limit') ? 429 : 401).json({
      success: false,
      error: validation.error,
      remaining: validation.remaining || null
    });
  }

  // Attach token info to request
  req.apiToken = validation.tokenData;
  req.apiRemaining = validation.remaining;

  // Record usage after response is sent
  res.on('finish', () => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      tokenService.recordUsage(apiKey);
    }
  });

  // Add rate limit headers
  res.setHeader('X-RateLimit-Limit-Daily', validation.tokenData.dailyLimit || 'unlimited');
  res.setHeader('X-RateLimit-Remaining-Daily', validation.remaining.daily);
  res.setHeader('X-RateLimit-Limit-Total', validation.tokenData.totalLimit || 'unlimited');
  res.setHeader('X-RateLimit-Remaining-Total', validation.remaining.total);

  next();
}

/**
 * Optional API Key - allows both authenticated and public access
 * Public access gets lower limits from IP-based rate limiting
 */
export function optionalApiKeyAuth(req, res, next) {
  const apiKey = 
    req.headers['x-api-key'] || 
    req.headers['authorization']?.replace('Bearer ', '') ||
    req.query.api_key ||
    req.query.key;  // Also support ?key= for browser URLs

  if (apiKey) {
    // Check if it's a user API key
    if (apiKey.startsWith('tiktok_') || apiKey.startsWith('youtube_')) {
      const user = getUserByApiKey(apiKey);
      
      if (user && user.credits > 0) {
        req.apiUser = user;
        req.apiRemaining = { credits: user.credits };
        
        res.on('finish', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              deductCredits(user.id, 1);
            } catch (err) {
              console.error('Failed to deduct credits:', err);
            }
          }
        });

        res.setHeader('X-RateLimit-Remaining-Credits', user.credits);
      }
    } else {
      // Check admin tokens
      const validation = tokenService.validateToken(apiKey);
      
      if (validation.valid) {
        req.apiToken = validation.tokenData;
        req.apiRemaining = validation.remaining;
        
        res.on('finish', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            tokenService.recordUsage(apiKey);
          }
        });

        res.setHeader('X-RateLimit-Limit-Daily', validation.tokenData.dailyLimit || 'unlimited');
        res.setHeader('X-RateLimit-Remaining-Daily', validation.remaining.daily);
      }
    }
  }

  next();
}
