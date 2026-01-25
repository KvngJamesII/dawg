import axios from 'axios';
import { extractVideoId, getRandomUserAgent } from '../utils/helpers.js';

export class TikTokService {
  constructor() {
    this.client = axios.create({
      timeout: 30000,
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
      }
    });
  }

  async download(url) {
    try {
      // Resolve short URLs first
      const finalUrl = await this.resolveShortUrl(url);
      const videoId = this.extractVideoId(finalUrl);
      
      if (!videoId) {
        throw new Error('Could not extract video ID from URL');
      }

      // Try multiple methods to get working download URLs
      
      // Method 1: Try tikwm.com API (returns direct downloadable URLs)
      try {
        const tikwmData = await this.fetchFromTikwm(url);
        if (tikwmData && tikwmData.video?.noWatermark) {
          return { videoId, ...tikwmData };
        }
      } catch (e) {
        console.log('tikwm failed:', e.message);
      }

      // Method 2: Try ssstik approach
      try {
        const ssstikData = await this.fetchFromSsstik(url);
        if (ssstikData && ssstikData.video?.noWatermark) {
          return { videoId, ...ssstikData };
        }
      } catch (e) {
        console.log('ssstik failed:', e.message);
      }

      // Method 3: Fallback to oEmbed for metadata only
      const oembedData = await this.fetchFromOembed(finalUrl);
      return { 
        videoId, 
        ...oembedData,
        note: 'Direct download URLs not available. Try copying the video URL manually.'
      };

    } catch (error) {
      console.error('TikTok download error:', error.message);
      throw new Error(`Failed to download TikTok video: ${error.message}`);
    }
  }

  async fetchFromTikwm(url) {
    try {
      const response = await axios.post(
        'https://www.tikwm.com/api/',
        new URLSearchParams({
          url: url,
          hd: '1'
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': getRandomUserAgent(),
            'Accept': 'application/json',
            'Origin': 'https://www.tikwm.com',
            'Referer': 'https://www.tikwm.com/'
          },
          timeout: 15000
        }
      );

      const data = response.data;

      if (data.code !== 0 || !data.data) {
        return null;
      }

      const videoData = data.data;
      const videoId = videoData.id;
      
      // Use tikwm's proxy URLs - these are directly downloadable without any blocking
      // Format: https://www.tikwm.com/video/media/{type}/{videoId}.mp4
      const noWatermarkUrl = `https://www.tikwm.com/video/media/play/${videoId}.mp4`;
      const hdUrl = `https://www.tikwm.com/video/media/hdplay/${videoId}.mp4`;
      const watermarkUrl = videoData.wmplay || null;
      const musicUrl = videoData.music || null;

      return {
        video: {
          noWatermark: hdUrl || noWatermarkUrl,
          watermark: watermarkUrl,
          hdNoWatermark: hdUrl,
          quality: 'HD'
        },
        downloadUrls: {
          noWatermark: hdUrl || noWatermarkUrl,
          hdNoWatermark: hdUrl,
          watermark: watermarkUrl,
          audio: musicUrl
        },
        music: videoData.music_info?.title || 'original sound',
        musicUrl: musicUrl,
        author: videoData.author?.nickname || 'unknown',
        authorUsername: videoData.author?.unique_id,
        authorAvatar: videoData.author?.avatar,
        description: videoData.title || '',
        thumbnail: videoData.cover || videoData.origin_cover,
        duration: videoData.duration,
        createTime: videoData.create_time,
        stats: {
          plays: videoData.play_count,
          likes: videoData.digg_count,
          comments: videoData.comment_count,
          shares: videoData.share_count
        }
      };
    } catch (error) {
      console.log('tikwm API error:', error.message);
      return null;
    }
  }

  async fetchFromSsstik(url) {
    try {
      // First get the page to extract the token
      const pageRes = await axios.get('https://ssstik.io/en', {
        headers: {
          'User-Agent': getRandomUserAgent()
        }
      });

      // Extract the tt token from the page
      const ttMatch = pageRes.data.match(/tt:'([^']+)'/);
      if (!ttMatch) {
        return null;
      }

      const tt = ttMatch[1];

      // Make the API request
      const response = await axios.post(
        'https://ssstik.io/abc?url=dl',
        new URLSearchParams({
          id: url,
          locale: 'en',
          tt: tt
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': getRandomUserAgent(),
            'Origin': 'https://ssstik.io',
            'Referer': 'https://ssstik.io/en'
          }
        }
      );

      const html = response.data;

      // Parse the download links from HTML response
      const noWmMatch = html.match(/href="([^"]+)"[^>]*>Without watermark/);
      const wmMatch = html.match(/href="([^"]+)"[^>]*>With watermark/);
      const musicMatch = html.match(/href="([^"]+)"[^>]*>Music/);
      const descMatch = html.match(/<p class="maintext">([^<]+)</);
      const authorMatch = html.match(/@([a-zA-Z0-9_.]+)/);

      if (!noWmMatch && !wmMatch) {
        return null;
      }

      return {
        video: {
          noWatermark: noWmMatch ? noWmMatch[1] : null,
          watermark: wmMatch ? wmMatch[1] : null,
          quality: 'HD'
        },
        downloadUrls: {
          noWatermark: noWmMatch ? noWmMatch[1] : null,
          watermark: wmMatch ? wmMatch[1] : null,
          audio: musicMatch ? musicMatch[1] : null
        },
        description: descMatch ? descMatch[1].trim() : '',
        author: authorMatch ? authorMatch[1] : 'unknown',
        music: 'original sound'
      };
    } catch (error) {
      console.log('ssstik API error:', error.message);
      return null;
    }
  }

  async fetchFromOembed(url) {
    const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
    
    const response = await this.client.get(oembedUrl);
    const data = response.data;

    return {
      author: data.author_name || 'unknown',
      authorUrl: data.author_url || null,
      title: data.title || '',
      description: data.title || '',
      thumbnail: data.thumbnail_url || null,
      thumbnailWidth: data.thumbnail_width,
      thumbnailHeight: data.thumbnail_height,
      video: {
        noWatermark: null,
        watermark: null,
        quality: 'HD'
      },
      downloadUrls: {
        noWatermark: null,
        watermark: null
      }
    };
  }

  async resolveShortUrl(url) {
    if (url.includes('vm.tiktok.com') || url.includes('vt.tiktok.com')) {
      try {
        const response = await this.client.get(url, {
          maxRedirects: 0,
          validateStatus: (status) => status >= 200 && status < 400
        });
        return response.headers.location || url;
      } catch (error) {
        if (error.response?.headers?.location) {
          return error.response.headers.location;
        }
      }
    }
    return url;
  }

  extractVideoId(url) {
    const patterns = [
      /\/video\/(\d+)/,
      /\/v\/(\d+)/,
      /\?v=(\d+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }

    return null;
  }

  parseVideoData(html, videoId) {
    // Fallback parsing from HTML
    try {
      const videoUrlPatterns = [
        /"playAddr"\s*:\s*"([^"]+)"/,
        /"downloadAddr"\s*:\s*"([^"]+)"/
      ];

      let videoUrl = null;
      for (const pattern of videoUrlPatterns) {
        const match = html.match(pattern);
        if (match) {
          videoUrl = match[1].replace(/\\u002F/g, '/').replace(/\\/g, '');
          break;
        }
      }

      const authorMatch = html.match(/"author"\s*:\s*{[^}]*"uniqueId"\s*:\s*"([^"]+)"/);
      const descMatch = html.match(/"desc"\s*:\s*"([^"]+)"/);
      const coverMatch = html.match(/"cover"\s*:\s*"([^"]+)"/);

      return {
        videoId,
        author: authorMatch ? authorMatch[1] : 'unknown',
        description: descMatch ? this.decodeUnicode(descMatch[1]) : '',
        thumbnail: coverMatch ? coverMatch[1].replace(/\\u002F/g, '/') : null,
        video: {
          noWatermark: videoUrl,
          watermark: videoUrl,
          quality: 'HD'
        },
        downloadUrls: {
          noWatermark: videoUrl,
          watermark: videoUrl
        }
      };
    } catch (error) {
      throw new Error('Failed to parse video data');
    }
  }

  decodeUnicode(str) {
    return str.replace(/\\u[\dA-F]{4}/gi, (match) => {
      return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
    });
  }
}
