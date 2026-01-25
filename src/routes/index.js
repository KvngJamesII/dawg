import express from 'express';
import { downloadController } from '../controllers/downloadController.js';
import { fileController } from '../controllers/fileController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { downloadSchema } from '../validators/downloadSchema.js';

const router = express.Router();

// Universal download endpoint
router.post('/download', validateRequest(downloadSchema), downloadController.download);

// Platform-specific endpoints
router.post('/tiktok', validateRequest(downloadSchema), downloadController.downloadTikTok);
router.post('/instagram', validateRequest(downloadSchema), downloadController.downloadInstagram);
router.post('/twitter', validateRequest(downloadSchema), downloadController.downloadTwitter);

// File download endpoints
router.get('/file/download', fileController.proxyDownload);  // Proxy download (streams the actual video)
router.post('/file/direct', fileController.getDirectDownload);  // Get direct download URL

// Get supported platforms
router.get('/platforms', downloadController.getPlatforms);

export default router;
