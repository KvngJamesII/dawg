import { TikTokService } from '../services/tiktokService.js';
import { InstagramService } from '../services/instagramService.js';
import { TwitterService } from '../services/twitterService.js';
import { downloadYouTubeAudio, isYouTubeUrl } from '../services/youtubeService.js';
import { detectPlatform } from '../utils/platformDetector.js';
import { tokenService } from '../services/tokenService.js';

const tiktokService = new TikTokService();
const instagramService = new InstagramService();
const twitterService = new TwitterService();

// Helper to validate API key (no tracking - middleware handles that)
function validateKey(key) {
  if (!key) return { valid: true, noKey: true }; // Allow requests without key (public rate limited)
  return tokenService.validateToken(key);
}

export const downloadController = {
  // Universal download - auto-detects platform
  async download(req, res, next) {
    try {
      const { url } = req.body;
      const platform = detectPlatform(url);

      if (!platform) {
        return res.status(400).json({
          success: false,
          error: 'Unsupported platform. Supported: TikTok, Instagram, Twitter/X'
        });
      }

      let result;
      switch (platform) {
        case 'tiktok':
          result = await tiktokService.download(url);
          break;
        case 'instagram':
          result = await instagramService.download(url);
          break;
        case 'twitter':
          result = await twitterService.download(url);
          break;
      }

      res.json({
        success: true,
        platform,
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  // TikTok specific
  async downloadTikTok(req, res, next) {
    try {
      const { url } = req.body;
      
      if (!url.includes('tiktok.com')) {
        return res.status(400).json({
          success: false,
          error: 'Invalid TikTok URL'
        });
      }

      const result = await tiktokService.download(url);
      res.json({
        success: true,
        platform: 'tiktok',
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  // Instagram specific
  async downloadInstagram(req, res, next) {
    try {
      const { url } = req.body;
      
      if (!url.includes('instagram.com')) {
        return res.status(400).json({
          success: false,
          error: 'Invalid Instagram URL'
        });
      }

      const result = await instagramService.download(url);
      res.json({
        success: true,
        platform: 'instagram',
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  // Twitter specific
  async downloadTwitter(req, res, next) {
    try {
      const { url } = req.body;
      
      if (!url.includes('twitter.com') && !url.includes('x.com')) {
        return res.status(400).json({
          success: false,
          error: 'Invalid Twitter/X URL'
        });
      }

      const result = await twitterService.download(url);
      res.json({
        success: true,
        platform: 'twitter',
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  // YouTube Audio (MP3)
  async downloadYouTube(req, res, next) {
    try {
      const { url } = req.body;
      
      if (!isYouTubeUrl(url)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid YouTube URL'
        });
      }

      const result = await downloadYouTubeAudio(url);
      res.json({
        success: true,
        platform: 'youtube',
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  // List supported platforms
  getPlatforms(req, res) {
    res.json({
      success: true,
      platforms: [
        {
          name: 'TikTok',
          endpoint: '/api/tiktok',
          supportedUrls: [
            'https://www.tiktok.com/@username/video/1234567890',
            'https://vm.tiktok.com/XXXXXXXX/',
            'https://vt.tiktok.com/XXXXXXXX/'
          ],
          features: ['No watermark', 'HD quality', 'Audio extraction']
        },
        {
          name: 'Instagram',
          endpoint: '/api/instagram',
          supportedUrls: [
            'https://www.instagram.com/reel/XXXXXXXXXXX/',
            'https://www.instagram.com/p/XXXXXXXXXXX/'
          ],
          features: ['Reels', 'Posts', 'HD quality']
        },
        {
          name: 'Twitter/X',
          endpoint: '/api/twitter',
          supportedUrls: [
            'https://twitter.com/username/status/1234567890',
            'https://x.com/username/status/1234567890'
          ],
          features: ['Multiple qualities', 'GIF support']
        },
        {
          name: 'YouTube (Audio/MP3)',
          endpoint: '/api/youtube',
          supportedUrls: [
            'https://www.youtube.com/watch?v=XXXXXXXXXXX',
            'https://youtu.be/XXXXXXXXXXX',
            'https://www.youtube.com/shorts/XXXXXXXXXXX'
          ],
          features: ['MP3 extraction', 'High quality audio', 'Shorts support']
        }
      ]
    });
  },

  // ============================================
  // GET endpoints for browser URL access
  // ============================================

  // Universal GET download
  async downloadGet(req, res, next) {
    try {
      const { url, key } = req.query;
      
      if (!url) {
        return res.json({
          success: false,
          error: 'Missing url parameter',
          usage: {
            endpoint: '/api/download',
            method: 'GET',
            params: {
              url: 'Video URL (required)',
              key: 'API key (optional)'
            },
            example: '/api/download?url=https://www.tiktok.com/@user/video/123&key=your_api_key'
          }
        });
      }

      // Validate and track API key usage
      if (key) {
        const validation = validateKey(key);
        if (!validation.valid) {
          return res.json({
            success: false,
            error: validation.error
          });
        }
      }

      const platform = detectPlatform(url);
      if (!platform) {
        return res.json({
          success: false,
          error: 'Unsupported platform. Supported: TikTok, Instagram, Twitter/X'
        });
      }

      let result;
      switch (platform) {
        case 'tiktok':
          result = await tiktokService.download(url);
          break;
        case 'instagram':
          result = await instagramService.download(url);
          break;
        case 'twitter':
          result = await twitterService.download(url);
          break;
      }

      res.json({
        success: true,
        platform,
        data: result
      });
    } catch (error) {
      res.json({
        success: false,
        error: error.message
      });
    }
  },

  // TikTok GET
  async downloadTikTokGet(req, res, next) {
    try {
      const { url, key } = req.query;
      
      if (!url) {
        return res.json({
          success: false,
          error: 'Missing url parameter',
          usage: {
            endpoint: '/api/tiktok',
            method: 'GET',
            params: {
              url: 'TikTok video URL (required)',
              key: 'API key (optional)'
            },
            example: '/api/tiktok?url=https://www.tiktok.com/@user/video/123&key=your_api_key'
          }
        });
      }

      // Validate and track API key usage
      if (key) {
        const validation = validateKey(key);
        if (!validation.valid) {
          return res.json({
            success: false,
            error: validation.error
          });
        }
      }

      if (!url.includes('tiktok.com') && !url.includes('vm.tiktok') && !url.includes('vt.tiktok')) {
        return res.json({
          success: false,
          error: 'Invalid TikTok URL'
        });
      }

      const result = await tiktokService.download(url);
      res.json({
        success: true,
        platform: 'tiktok',
        data: result
      });
    } catch (error) {
      res.json({
        success: false,
        error: error.message
      });
    }
  },

  // Instagram GET
  async downloadInstagramGet(req, res, next) {
    try {
      const { url, key } = req.query;
      
      if (!url) {
        return res.json({
          success: false,
          error: 'Missing url parameter',
          usage: {
            endpoint: '/api/instagram',
            method: 'GET',
            params: {
              url: 'Instagram reel/post URL (required)',
              key: 'API key (optional)'
            },
            example: '/api/instagram?url=https://www.instagram.com/reel/ABC123&key=your_api_key'
          }
        });
      }

      // Validate and track API key usage
      if (key) {
        const validation = validateKey(key);
        if (!validation.valid) {
          return res.json({
            success: false,
            error: validation.error
          });
        }
      }

      if (!url.includes('instagram.com')) {
        return res.json({
          success: false,
          error: 'Invalid Instagram URL'
        });
      }

      const result = await instagramService.download(url);
      res.json({
        success: true,
        platform: 'instagram',
        data: result
      });
    } catch (error) {
      res.json({
        success: false,
        error: error.message
      });
    }
  },

  // Twitter GET
  async downloadTwitterGet(req, res, next) {
    try {
      const { url, key } = req.query;
      
      if (!url) {
        return res.json({
          success: false,
          error: 'Missing url parameter',
          usage: {
            endpoint: '/api/twitter',
            method: 'GET',
            params: {
              url: 'Twitter/X video URL (required)',
              key: 'API key (optional)'
            },
            example: '/api/twitter?url=https://twitter.com/user/status/123&key=your_api_key'
          }
        });
      }

      // Validate and track API key usage
      if (key) {
        const validation = validateKey(key);
        if (!validation.valid) {
          return res.json({
            success: false,
            error: validation.error
          });
        }
      }

      if (!url.includes('twitter.com') && !url.includes('x.com')) {
        return res.json({
          success: false,
          error: 'Invalid Twitter/X URL'
        });
      }

      const result = await twitterService.download(url);
      res.json({
        success: true,
        platform: 'twitter',
        data: result
      });
    } catch (error) {
      res.json({
        success: false,
        error: error.message
      });
    }
  },

  // YouTube GET (Audio/MP3)
  async downloadYouTubeGet(req, res, next) {
    try {
      const { url, key } = req.query;
      
      if (!url) {
        return res.json({
          success: false,
          error: 'Missing url parameter',
          usage: {
            endpoint: '/api/youtube',
            method: 'GET',
            params: {
              url: 'YouTube video URL (required)',
              key: 'API key (optional)'
            },
            example: '/api/youtube?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ&key=your_api_key'
          }
        });
      }

      // Validate and track API key usage
      if (key) {
        const validation = validateKey(key);
        if (!validation.valid) {
          return res.json({
            success: false,
            error: validation.error
          });
        }
      }

      if (!isYouTubeUrl(url)) {
        return res.json({
          success: false,
          error: 'Invalid YouTube URL'
        });
      }

      const result = await downloadYouTubeAudio(url);
      res.json({
        success: true,
        platform: 'youtube',
        data: result
      });
    } catch (error) {
      res.json({
        success: false,
        error: error.message
      });
    }
  }
};
