import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import routes from './routes/index.js';
import adminRoutes, { isApiKeyRequired } from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import userAdminRoutes from './routes/userAdminRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiKeyAuth, optionalApiKeyAuth } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from project root (parent of src/)
dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy (needed when behind Nginx/reverse proxy)
app.set('trust proxy', 1);

// Security middleware - configure helmet to allow inline scripts for admin dashboard
app.use(helmet({
  contentSecurityPolicy: false  // Disable CSP for now to allow dashboard
}));
app.use(cors());
app.use(express.json());

// Serve static files (admin dashboard)
app.use('/admin', express.static(join(__dirname, 'public', 'admin')));

// Serve frontend build (if exists)
app.use(express.static(join(__dirname, '..', 'frontend', 'dist')));

// Rate limiting for unauthenticated requests (stricter)
const publicLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 20, // Lower for public
  message: {
    success: false,
    error: 'Too many requests, please try again later. Get an API key for higher limits!'
  },
  skip: (req) => req.apiToken // Skip if authenticated
});

// Auth routes (no auth required)
app.use('/api/auth', authRoutes);

// User routes (JWT auth required)
app.use('/api/user', userRoutes);

// User admin routes (JWT + isAdmin required)  
app.use('/api/admin', userAdminRoutes);

// Payment routes
app.use('/api/payments', paymentRoutes);

// Token admin routes (X-Admin-Key required - legacy)
app.use('/api/token-admin', adminRoutes);

// Dynamic auth middleware that checks runtime settings
function dynamicAuth(req, res, next) {
  if (isApiKeyRequired()) {
    return apiKeyAuth(req, res, next);
  } else {
    return optionalApiKeyAuth(req, res, next);
  }
}

// Routes - with dynamic auth based on runtime settings
app.use('/api', publicLimiter, dynamicAuth, routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve React app for all other routes (client-side routing)
app.get('*', (req, res) => {
  const indexPath = join(__dirname, '..', 'frontend', 'dist', 'index.html');
  if (existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({
      success: false,
      error: 'Frontend not built. Run: cd frontend && npm run build'
    });
  }
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║     🎬 IdleDeveloper API Platform                             ║
║     Running on http://localhost:${PORT}                          ║
╠═══════════════════════════════════════════════════════════════╣
║  API Endpoints:                                               ║
║  POST /api/download        - Download from any platform       ║
║  POST /api/tiktok          - Download TikTok videos           ║
║  POST /api/instagram       - Download Instagram Reels         ║
║  POST /api/twitter         - Download Twitter/X videos        ║
║  GET  /api/youtube         - Extract YouTube audio            ║
╠═══════════════════════════════════════════════════════════════╣
║  Auth Endpoints:                                              ║
║  POST /api/auth/register   - Register new user                ║
║  POST /api/auth/login      - Login user                       ║
║  GET  /api/auth/google     - Google OAuth                     ║
╠═══════════════════════════════════════════════════════════════╣
║  Payment Endpoints:                                           ║
║  GET  /api/payments/packages    - Get credit packages         ║
║  POST /api/payments/initialize  - Start payment               ║
║  GET  /api/payments/verify/:ref - Verify payment              ║
╚═══════════════════════════════════════════════════════════════╝
  `);
});

export default app;
