import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '../database/tokens.json');

export class TokenService {
  constructor() {
    this.ensureDbExists();
  }

  ensureDbExists() {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify({ tokens: {} }, null, 2));
    }
  }

  loadDb() {
    try {
      const data = fs.readFileSync(DB_PATH, 'utf8');
      return JSON.parse(data);
    } catch {
      return { tokens: {} };
    }
  }

  saveDb(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  }

  generateToken() {
    // Generate a secure API key: sk_live_xxxxxxxxxxxx
    const randomPart = crypto.randomBytes(24).toString('hex');
    return `sk_live_${randomPart}`;
  }

  /**
   * Create a new API token
   * @param {Object} options
   * @param {string} options.name - Name/description for the token
   * @param {number} options.dailyLimit - Max requests per day (0 = unlimited)
   * @param {number} options.totalLimit - Max lifetime requests (0 = unlimited)
   * @param {string[]} options.allowedEndpoints - Specific endpoints allowed (empty = all)
   */
  createToken({ name, dailyLimit = 100, totalLimit = 0, allowedEndpoints = [] }) {
    const db = this.loadDb();
    const token = this.generateToken();
    const now = new Date().toISOString();

    db.tokens[token] = {
      name,
      token,
      dailyLimit,
      totalLimit,
      allowedEndpoints,
      usage: {
        total: 0,
        daily: 0,
        lastReset: now.split('T')[0] // YYYY-MM-DD
      },
      active: true,
      createdAt: now,
      lastUsedAt: null
    };

    this.saveDb(db);
    return db.tokens[token];
  }

  /**
   * Validate token and check limits
   * @param {string} token 
   * @returns {{ valid: boolean, error?: string, tokenData?: object }}
   */
  validateToken(token) {
    const db = this.loadDb();
    const tokenData = db.tokens[token];

    if (!tokenData) {
      return { valid: false, error: 'Invalid API key' };
    }

    if (!tokenData.active) {
      return { valid: false, error: 'API key is disabled' };
    }

    // Check if we need to reset daily counter
    const today = new Date().toISOString().split('T')[0];
    if (tokenData.usage.lastReset !== today) {
      tokenData.usage.daily = 0;
      tokenData.usage.lastReset = today;
      this.saveDb(db);
    }

    // Check daily limit
    if (tokenData.dailyLimit > 0 && tokenData.usage.daily >= tokenData.dailyLimit) {
      return { 
        valid: false, 
        error: 'Daily limit exceeded',
        remaining: 0,
        resetAt: 'midnight UTC'
      };
    }

    // Check total limit
    if (tokenData.totalLimit > 0 && tokenData.usage.total >= tokenData.totalLimit) {
      return { 
        valid: false, 
        error: 'Total usage limit exceeded',
        remaining: 0
      };
    }

    return { 
      valid: true, 
      tokenData,
      remaining: {
        daily: tokenData.dailyLimit > 0 ? tokenData.dailyLimit - tokenData.usage.daily : 'unlimited',
        total: tokenData.totalLimit > 0 ? tokenData.totalLimit - tokenData.usage.total : 'unlimited'
      }
    };
  }

  /**
   * Record API usage for a token
   * @param {string} token 
   */
  recordUsage(token) {
    const db = this.loadDb();
    const tokenData = db.tokens[token];

    if (!tokenData) return;

    const today = new Date().toISOString().split('T')[0];
    
    // Reset daily if new day
    if (tokenData.usage.lastReset !== today) {
      tokenData.usage.daily = 0;
      tokenData.usage.lastReset = today;
    }

    tokenData.usage.daily++;
    tokenData.usage.total++;
    tokenData.lastUsedAt = new Date().toISOString();

    this.saveDb(db);
  }

  /**
   * Get token info
   * @param {string} token 
   */
  getTokenInfo(token) {
    const db = this.loadDb();
    return db.tokens[token] || null;
  }

  /**
   * List all tokens
   */
  listTokens() {
    const db = this.loadDb();
    return Object.values(db.tokens).map(t => ({
      name: t.name,
      token: t.token.substring(0, 15) + '...' + t.token.substring(t.token.length - 4),
      dailyLimit: t.dailyLimit,
      totalLimit: t.totalLimit,
      usage: t.usage,
      active: t.active,
      createdAt: t.createdAt,
      lastUsedAt: t.lastUsedAt
    }));
  }

  /**
   * Update token settings
   * @param {string} token 
   * @param {Object} updates 
   */
  updateToken(token, updates) {
    const db = this.loadDb();
    
    if (!db.tokens[token]) {
      return null;
    }

    const allowedUpdates = ['name', 'dailyLimit', 'totalLimit', 'active', 'allowedEndpoints'];
    
    for (const key of allowedUpdates) {
      if (updates[key] !== undefined) {
        db.tokens[token][key] = updates[key];
      }
    }

    this.saveDb(db);
    return db.tokens[token];
  }

  /**
   * Delete a token
   * @param {string} token 
   */
  deleteToken(token) {
    const db = this.loadDb();
    
    if (!db.tokens[token]) {
      return false;
    }

    delete db.tokens[token];
    this.saveDb(db);
    return true;
  }

  /**
   * Reset usage for a token
   * @param {string} token 
   * @param {boolean} resetTotal - Also reset total usage
   */
  resetUsage(token, resetTotal = false) {
    const db = this.loadDb();
    
    if (!db.tokens[token]) {
      return false;
    }

    db.tokens[token].usage.daily = 0;
    db.tokens[token].usage.lastReset = new Date().toISOString().split('T')[0];
    
    if (resetTotal) {
      db.tokens[token].usage.total = 0;
    }

    this.saveDb(db);
    return true;
  }
}

export const tokenService = new TokenService();
