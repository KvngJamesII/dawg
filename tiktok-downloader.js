// Standalone TikTok Video Downloader (no server required)
import axios from 'axios';
import fs from 'fs';
import path from 'path';

class TikTokDownloader {
  constructor() {
    this.client = axios.create({
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
  }

  async download(url) {
    console.log('🎬 TikTok Video Downloader');
    console.log('📎 URL:', url);
    console.log('');

    // Step 1: Resolve short URL and get video info
    console.log('🔍 Fetching video info...');
    
    const data = await this.fetchFromTikwm(url);
    
    if (!data) {
      throw new Error('Failed to get video info');
    }

    console.log('📹 Video:', data.description || 'No description');
    console.log('👤 Author:', data.author);
    console.log('🎵 Music:', data.music || 'Unknown');
    
    // Step 2: Download the video
    const downloadUrl = data.downloadUrls.hdNoWatermark || data.downloadUrls.noWatermark;
    
    if (!downloadUrl) {
      throw new Error('No download URL found');
    }

    console.log('🔗 Download URL found');
    console.log('');

    // Create safe filename
    const safeAuthor = (data.author || 'video').replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `tiktok_${safeAuthor}_${data.videoId}.mp4`;
    const outputPath = path.join(process.cwd(), filename);

    console.log('⏳ Downloading video (HD, No Watermark)...');

    const response = await axios({
      method: 'GET',
      url: downloadUrl,
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.tikwm.com/',
        'Accept': '*/*'
      },
      timeout: 120000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    fs.writeFileSync(outputPath, response.data);

    const stats = fs.statSync(outputPath);
    console.log('');
    console.log('✅ Downloaded successfully!');
    console.log('📁 Saved to:', outputPath);
    console.log('📊 File size:', (stats.size / 1024 / 1024).toFixed(2) + ' MB');

    return outputPath;
  }

  async fetchFromTikwm(url) {
    const response = await axios.post(
      'https://www.tikwm.com/api/',
      new URLSearchParams({
        url: url,
        hd: '1'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Origin': 'https://www.tikwm.com',
          'Referer': 'https://www.tikwm.com/'
        },
        timeout: 15000
      }
    );

    const data = response.data;

    if (data.code !== 0 || !data.data) {
      throw new Error('tikwm API returned error');
    }

    const videoData = data.data;
    const videoId = videoData.id;

    // Use tikwm's proxy URLs for reliable downloads
    const noWatermarkUrl = `https://www.tikwm.com/video/media/play/${videoId}.mp4`;
    const hdUrl = `https://www.tikwm.com/video/media/hdplay/${videoId}.mp4`;
    const musicUrl = videoData.music || null;

    return {
      videoId,
      video: {
        noWatermark: hdUrl || noWatermarkUrl,
        watermark: videoData.wmplay,
        hdNoWatermark: hdUrl,
        quality: 'HD'
      },
      downloadUrls: {
        noWatermark: noWatermarkUrl,
        hdNoWatermark: hdUrl,
        watermark: videoData.wmplay,
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
  }
}

// Main execution
const url = process.argv[2];

if (!url) {
  console.log('Usage: node tiktok-downloader.js <tiktok-url>');
  console.log('');
  console.log('Examples:');
  console.log('  node tiktok-downloader.js https://www.tiktok.com/@user/video/123456');
  console.log('  node tiktok-downloader.js https://vt.tiktok.com/ZSxxx/');
  console.log('  node tiktok-downloader.js https://vm.tiktok.com/ZMxxx/');
  process.exit(1);
}

const downloader = new TikTokDownloader();
downloader.download(url).catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
