import { TikTokService } from '../services/tiktokService.js';
import { InstagramService } from '../services/instagramService.js';
import { TwitterService } from '../services/twitterService.js';
import { detectPlatform } from '../utils/platformDetector.js';

const tiktokService = new TikTokService();
const instagramService = new InstagramService();
const twitterService = new TwitterService();

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
        }
      ]
    });
  }
};
