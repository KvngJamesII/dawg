import axios from 'axios';
import { getRandomUserAgent } from '../utils/helpers.js';

export class TwitterService {
  constructor() {
    this.client = axios.create({
      timeout: 30000,
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive'
      }
    });

    // Twitter's public API token (guest token approach)
    this.bearerToken = 'AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs=1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA';
  }

  async download(url) {
    try {
      // Normalize URL (convert x.com to twitter.com if needed)
      const normalizedUrl = this.normalizeUrl(url);
      const tweetId = this.extractTweetId(normalizedUrl);

      if (!tweetId) {
        throw new Error('Could not extract tweet ID from URL');
      }

      // Fetch video data
      const videoData = await this.fetchVideoData(tweetId, normalizedUrl);

      return videoData;
    } catch (error) {
      console.error('Twitter download error:', error.message);
      throw new Error(`Failed to download Twitter video: ${error.message}`);
    }
  }

  normalizeUrl(url) {
    return url.replace('x.com', 'twitter.com');
  }

  extractTweetId(url) {
    const patterns = [
      /\/status\/(\d+)/,
      /\/statuses\/(\d+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }

    return null;
  }

  async fetchVideoData(tweetId, originalUrl) {
    // Method 1: Try using the syndication API (works without auth)
    try {
      const syndicationData = await this.fetchFromSyndication(tweetId);
      if (syndicationData) {
        return syndicationData;
      }
    } catch (e) {
      console.log('Syndication method failed, trying alternative...');
    }

    // Method 2: Try fetching the page and parsing
    const pageData = await this.fetchFromPage(originalUrl, tweetId);
    return pageData;
  }

  async fetchFromSyndication(tweetId) {
    const response = await this.client.get(
      `https://cdn.syndication.twimg.com/tweet-result?id=${tweetId}&lang=en&token=0`,
      {
        headers: {
          'User-Agent': getRandomUserAgent()
        }
      }
    );

    const data = response.data;

    if (!data || !data.mediaDetails || data.mediaDetails.length === 0) {
      throw new Error('No media found in tweet');
    }

    const media = data.mediaDetails[0];
    
    if (media.type !== 'video' && media.type !== 'animated_gif') {
      throw new Error('Tweet does not contain a video');
    }

    // Extract video variants
    const variants = media.video_info?.variants || [];
    const videoVariants = variants
      .filter(v => v.content_type === 'video/mp4')
      .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));

    if (videoVariants.length === 0) {
      throw new Error('No downloadable video found');
    }

    return {
      tweetId,
      author: data.user?.screen_name || 'unknown',
      authorName: data.user?.name || '',
      text: data.text || '',
      thumbnail: media.media_url_https || null,
      type: media.type === 'animated_gif' ? 'gif' : 'video',
      duration: media.video_info?.duration_millis 
        ? Math.round(media.video_info.duration_millis / 1000) 
        : null,
      video: {
        qualities: videoVariants.map(v => ({
          url: v.url,
          quality: this.getQualityLabel(v.bitrate),
          bitrate: v.bitrate
        })),
        best: videoVariants[0].url
      },
      downloadUrls: {
        best: videoVariants[0].url,
        all: videoVariants.map(v => ({
          url: v.url,
          quality: this.getQualityLabel(v.bitrate)
        }))
      }
    };
  }

  async fetchFromPage(url, tweetId) {
    const response = await this.client.get(url, {
      headers: {
        'User-Agent': getRandomUserAgent()
      }
    });

    const html = response.data;
    
    // Try to extract video URL from meta tags and embedded data
    const videoUrlPatterns = [
      /property="og:video:url"\s+content="([^"]+)"/,
      /property="og:video"\s+content="([^"]+)"/,
      /"video_url"\s*:\s*"([^"]+)"/,
      /https:\/\/video\.twimg\.com\/[^"'\s]+\.mp4[^"'\s]*/g
    ];

    let videoUrl = null;
    for (const pattern of videoUrlPatterns) {
      const match = html.match(pattern);
      if (match) {
        videoUrl = match[1] || match[0];
        videoUrl = videoUrl.replace(/&amp;/g, '&');
        break;
      }
    }

    // Extract thumbnail
    const thumbnailMatch = html.match(/property="og:image"\s+content="([^"]+)"/);
    const thumbnail = thumbnailMatch ? thumbnailMatch[1] : null;

    // Extract author
    const authorMatch = html.match(/@([A-Za-z0-9_]+)/);
    const author = authorMatch ? authorMatch[1] : 'unknown';

    // Extract text
    const textMatch = html.match(/property="og:description"\s+content="([^"]+)"/);
    const text = textMatch ? this.decodeHtml(textMatch[1]) : '';

    if (!videoUrl) {
      throw new Error('Could not find video URL - tweet might not contain a video');
    }

    return {
      tweetId,
      author,
      text,
      thumbnail,
      type: 'video',
      video: {
        qualities: [{
          url: videoUrl,
          quality: 'Unknown'
        }],
        best: videoUrl
      },
      downloadUrls: {
        best: videoUrl,
        all: [{
          url: videoUrl,
          quality: 'Unknown'
        }]
      }
    };
  }

  getQualityLabel(bitrate) {
    if (!bitrate) return 'Unknown';
    if (bitrate >= 2000000) return '1080p';
    if (bitrate >= 1000000) return '720p';
    if (bitrate >= 500000) return '480p';
    if (bitrate >= 200000) return '360p';
    return '240p';
  }

  decodeHtml(html) {
    return html
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'");
  }
}
