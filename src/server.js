import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import routes from './routes/index.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiKeyAuth, optionalApiKeyAuth } from './middleware/auth.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware - configure helmet to allow inline scripts for admin dashboard
app.use(helmet({
  contentSecurityPolicy: false  // Disable CSP for now to allow dashboard
}));
app.use(cors());
app.use(express.json());

// Serve static files (admin dashboard)
app.use('/admin', express.static(join(__dirname, 'public', 'admin')));

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

// Determine if API requires authentication
const REQUIRE_AUTH = process.env.REQUIRE_API_KEY === 'true';

// Admin routes (separate, always need admin key)
app.use('/api/admin', adminRoutes);

// Routes - with optional or required auth based on config
if (REQUIRE_AUTH) {
  app.use('/api', apiKeyAuth, routes);
} else {
  app.use('/api', publicLimiter, optionalApiKeyAuth, routes);
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║     🎬 Social Media Video Downloader API                      ║
║     Running on http://localhost:${PORT}                          ║
╠═══════════════════════════════════════════════════════════════╣
║  API Endpoints (${REQUIRE_AUTH ? 'Auth Required' : 'Public + Auth'}):                               ║
║  POST /api/download        - Download from any platform       ║
║  POST /api/tiktok          - Download TikTok videos           ║
║  POST /api/instagram       - Download Instagram Reels         ║
║  POST /api/twitter         - Download Twitter/X videos        ║
║  GET  /api/file/download   - Direct file download             ║
║  GET  /api/platforms       - List supported platforms         ║
╠═══════════════════════════════════════════════════════════════╣
║  🔧 Admin Dashboard: http://localhost:${PORT}/admin               ║
╠═══════════════════════════════════════════════════════════════╣
║  Admin API Endpoints (X-Admin-Key required):                  ║
║  GET    /api/admin/stats        - Get statistics              ║
║  POST   /api/admin/tokens       - Create new API token        ║
║  GET    /api/admin/tokens       - List all tokens             ║
║  PUT    /api/admin/tokens/:t    - Update token                ║
║  DELETE /api/admin/tokens/:t    - Delete token                ║
╠═══════════════════════════════════════════════════════════════╣
║  CLI: node token-cli.js help                                  ║
╚═══════════════════════════════════════════════════════════════╝
  `);
});

export default app;
