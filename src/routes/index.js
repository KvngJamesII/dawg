import express from 'express';
import { downloadController } from '../controllers/downloadController.js';
import { fileController } from '../controllers/fileController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { downloadSchema } from '../validators/downloadSchema.js';

const router = express.Router();

// ============================================
// Browser-friendly GET endpoints (URL-based)
// Usage: /api/tiktok?key=API_KEY&url=VIDEO_URL
// ============================================
router.get('/download', downloadController.downloadGet);
router.get('/tiktok', downloadController.downloadTikTokGet);
router.get('/instagram', downloadController.downloadInstagramGet);
router.get('/twitter', downloadController.downloadTwitterGet);

// ============================================
// POST endpoints (JSON body)
// ============================================
router.post('/download', validateRequest(downloadSchema), downloadController.download);
router.post('/tiktok', validateRequest(downloadSchema), downloadController.downloadTikTok);
router.post('/instagram', validateRequest(downloadSchema), downloadController.downloadInstagram);
router.post('/twitter', validateRequest(downloadSchema), downloadController.downloadTwitter);

// File download endpoints
router.get('/file/download', fileController.proxyDownload);  // Proxy download (streams the actual video)
router.post('/file/direct', fileController.getDirectDownload);  // Get direct download URL

// Get supported platforms
router.get('/platforms', downloadController.getPlatforms);

export default router;
