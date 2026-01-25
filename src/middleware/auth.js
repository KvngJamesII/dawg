import { tokenService } from '../services/tokenService.js';

/**
 * API Key Authentication Middleware
 * Checks for valid API key in header or query param
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

  // Validate the token
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

  next();
}
