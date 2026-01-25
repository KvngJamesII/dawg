import axios from 'axios';
import { getRandomUserAgent } from '../utils/helpers.js';

export const fileController = {
  /**
   * Proxy download - streams the video file to the client
   * This bypasses CORS and allows direct download
   */
  async proxyDownload(req, res, next) {
    try {
      const { url, filename } = req.query;

      if (!url) {
        return res.status(400).json({
          success: false,
          error: 'URL parameter is required'
        });
      }

      // Validate URL
      try {
        new URL(url);
      } catch {
        return res.status(400).json({
          success: false,
          error: 'Invalid URL format'
        });
      }

      // Fetch the video with streaming
      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream',
        timeout: 60000,
        headers: {
          'User-Agent': getRandomUserAgent(),
          'Referer': 'https://www.tiktok.com/',
          'Accept': '*/*'
        }
      });

      // Set headers for file download
      const contentType = response.headers['content-type'] || 'video/mp4';
      const contentLength = response.headers['content-length'];
      const downloadFilename = filename || `video_${Date.now()}.mp4`;

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${downloadFilename}"`);
      
      if (contentLength) {
        res.setHeader('Content-Length', contentLength);
      }

      // Pipe the video stream to response
      response.data.pipe(res);

      // Handle stream errors
      response.data.on('error', (err) => {
        console.error('Stream error:', err);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            error: 'Error streaming video'
          });
        }
      });

    } catch (error) {
      console.error('Proxy download error:', error.message);
      
      if (error.response?.status === 403) {
        return res.status(403).json({
          success: false,
          error: 'Video URL has expired. Please fetch a new URL.'
        });
      }

      next(error);
    }
  },

  /**
   * Get video info and direct download URL
   */
  async getDirectDownload(req, res, next) {
    try {
      const { url, platform } = req.body;

      if (!url) {
        return res.status(400).json({
          success: false,
          error: 'URL is required'
        });
      }

      // Import services dynamically
      const { TikTokService } = await import('../services/tiktokService.js');
      const { InstagramService } = await import('../services/instagramService.js');
      const { TwitterService } = await import('../services/twitterService.js');
      const { detectPlatform } = await import('../utils/platformDetector.js');

      const detectedPlatform = platform || detectPlatform(url);

      let result;
      let service;

      switch (detectedPlatform) {
        case 'tiktok':
          service = new TikTokService();
          result = await service.download(url);
          break;
        case 'instagram':
          service = new InstagramService();
          result = await service.download(url);
          break;
        case 'twitter':
          service = new TwitterService();
          result = await service.download(url);
          break;
        default:
          return res.status(400).json({
            success: false,
            error: 'Unsupported platform'
          });
      }

      // Build the proxy download URL
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const videoUrl = result.video?.noWatermark || result.video?.url || result.downloadUrls?.noWatermark;
      
      if (!videoUrl) {
        return res.status(404).json({
          success: false,
          error: 'Could not find video URL'
        });
      }

      const proxyUrl = `${baseUrl}/api/file/download?url=${encodeURIComponent(videoUrl)}&filename=${result.author || 'video'}_${result.videoId || Date.now()}.mp4`;

      res.json({
        success: true,
        platform: detectedPlatform,
        data: {
          ...result,
          directDownloadUrl: proxyUrl,
          originalVideoUrl: videoUrl
        }
      });

    } catch (error) {
      next(error);
    }
  }
};
