// Download script for TikTok videos
import axios from 'axios';
import fs from 'fs';
import path from 'path';

async function downloadTikTokVideo(tiktokUrl) {
  try {
    // Step 1: Get video info from our API
    console.log('🔍 Fetching video info...');
    const infoRes = await axios.post('http://localhost:3000/api/tiktok', {
      url: tiktokUrl
    });

    const info = infoRes.data;
    
    if (!info.success) {
      throw new Error(info.error || 'Failed to get video info');
    }

    console.log('📹 Video:', info.data.description || 'No description');
    console.log('👤 Author:', info.data.author);
    console.log('🎵 Music:', info.data.music || 'Unknown');

    // Step 2: Get the no-watermark URL
    const videoUrl = info.data.downloadUrls?.noWatermark || 
                     info.data.video?.noWatermark ||
                     info.data.downloadUrls?.watermark;

    if (!videoUrl) {
      throw new Error('No video URL found');
    }

    console.log('🔗 Video URL found');

    // Step 3: Download the video
    const filename = `tiktok_${info.data.author || 'video'}_${info.data.videoId || Date.now()}.mp4`;
    const outputPath = path.join(process.cwd(), filename);

    console.log('⏳ Downloading video...');

    // Use appropriate headers based on the URL source
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': '*/*'
    };

    // If it's from tikwm, use their referer
    if (videoUrl.includes('tikwm.com') || videoUrl.includes('tiktokcdn')) {
      headers['Referer'] = 'https://www.tikwm.com/';
    }

    const videoRes = await axios({
      method: 'GET',
      url: videoUrl,
      responseType: 'arraybuffer',
      headers: headers,
      timeout: 120000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    fs.writeFileSync(outputPath, videoRes.data);

    const stats = fs.statSync(outputPath);
    console.log('');
    console.log('✅ Downloaded successfully!');
    console.log('📁 Saved to:', outputPath);
    console.log('📊 File size:', (stats.size / 1024 / 1024).toFixed(2) + ' MB');

    return outputPath;

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
    }
    throw error;
  }
}

// Get URL from command line or use default test URL
const url = process.argv[2] || 'https://vt.tiktok.com/ZSf3vk9YH/';
console.log('🎬 TikTok Video Downloader');
console.log('📎 URL:', url);
console.log('');

downloadTikTokVideo(url);
