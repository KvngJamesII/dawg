import axios from 'axios';
import { getRandomUserAgent } from '../utils/helpers.js';

export class InstagramService {
  constructor() {
    this.client = axios.create({
      timeout: 30000,
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none'
      }
    });
  }

  async download(url) {
    try {
      // Clean and validate the URL
      const cleanUrl = this.cleanUrl(url);
      const postId = this.extractPostId(cleanUrl);

      if (!postId) {
        throw new Error('Could not extract post ID from URL');
      }

      // Try multiple methods to get the video
      const videoData = await this.fetchVideoData(cleanUrl, postId);

      return videoData;
    } catch (error) {
      console.error('Instagram download error:', error.message);
      throw new Error(`Failed to download Instagram video: ${error.message}`);
    }
  }

  cleanUrl(url) {
    // Remove query params and trailing slashes, ensure proper format
    let cleanUrl = url.split('?')[0];
    if (!cleanUrl.endsWith('/')) {
      cleanUrl += '/';
    }
    return cleanUrl;
  }

  extractPostId(url) {
    // Match patterns for reels and posts
    const patterns = [
      /\/reel\/([A-Za-z0-9_-]+)/,
      /\/p\/([A-Za-z0-9_-]+)/,
      /\/tv\/([A-Za-z0-9_-]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }

    return null;
  }

  async fetchVideoData(url, postId) {
    // Method 1: Try fetching the page directly
    const response = await this.client.get(url, {
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Cookie': '' // Empty cookie to avoid login prompts
      }
    });

    const html = response.data;
    
    // Parse the video data from the page
    const videoData = this.parseVideoData(html, postId);
    
    return videoData;
  }

  parseVideoData(html, postId) {
    try {
      // Instagram embeds data in various script tags
      const scriptPatterns = [
        /<script type="application\/ld\+json"[^>]*>([^<]+)<\/script>/g,
        /window\._sharedData\s*=\s*({.+?});/s,
        /window\.__additionalDataLoaded\s*\([^,]+,\s*({.+?})\);/s
      ];

      let videoUrl = null;
      let thumbnailUrl = null;
      let description = '';
      let author = '';

      // Try to find video URL in various patterns
      const videoUrlPatterns = [
        /"video_url"\s*:\s*"([^"]+)"/,
        /"contentUrl"\s*:\s*"([^"]+)"/,
        /property="og:video"\s+content="([^"]+)"/,
        /meta\s+content="([^"]+)"\s+property="og:video"/,
        /"playback_url"\s*:\s*"([^"]+)"/
      ];

      for (const pattern of videoUrlPatterns) {
        const match = html.match(pattern);
        if (match) {
          videoUrl = match[1]
            .replace(/\\u0026/g, '&')
            .replace(/\\/g, '');
          break;
        }
      }

      // Extract thumbnail
      const thumbnailPatterns = [
        /"thumbnail_url"\s*:\s*"([^"]+)"/,
        /"display_url"\s*:\s*"([^"]+)"/,
        /property="og:image"\s+content="([^"]+)"/,
        /meta\s+content="([^"]+)"\s+property="og:image"/
      ];

      for (const pattern of thumbnailPatterns) {
        const match = html.match(pattern);
        if (match) {
          thumbnailUrl = match[1]
            .replace(/\\u0026/g, '&')
            .replace(/\\/g, '');
          break;
        }
      }

      // Extract description
      const descPatterns = [
        /"caption"\s*:\s*{[^}]*"text"\s*:\s*"([^"]+)"/,
        /property="og:description"\s+content="([^"]+)"/,
        /meta\s+content="([^"]+)"\s+property="og:description"/
      ];

      for (const pattern of descPatterns) {
        const match = html.match(pattern);
        if (match) {
          description = this.decodeHtml(match[1]);
          break;
        }
      }

      // Extract author
      const authorPatterns = [
        /"username"\s*:\s*"([^"]+)"/,
        /"owner"\s*:\s*{[^}]*"username"\s*:\s*"([^"]+)"/
      ];

      for (const pattern of authorPatterns) {
        const match = html.match(pattern);
        if (match) {
          author = match[1];
          break;
        }
      }

      if (!videoUrl) {
        throw new Error('Could not find video URL - post might be private or not a video');
      }

      return {
        postId,
        author: author || 'unknown',
        description,
        thumbnail: thumbnailUrl,
        video: {
          url: videoUrl,
          quality: 'HD'
        },
        downloadUrls: {
          video: videoUrl
        },
        type: this.determineType(html)
      };
    } catch (error) {
      throw new Error('Failed to parse video data from Instagram page');
    }
  }

  determineType(html) {
    if (html.includes('/reel/') || html.includes('"is_video":true')) {
      return 'reel';
    } else if (html.includes('/p/')) {
      return 'post';
    }
    return 'unknown';
  }

  decodeHtml(html) {
    return html
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/\\n/g, '\n')
      .replace(/\\u[\dA-F]{4}/gi, (match) => {
        return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
      });
  }
}
