// Standalone test for TikTok video download using tikwm proxy
import axios from 'axios';
import fs from 'fs';

const videoId = '7389868091318078736';

async function testDownload() {
  console.log('🎬 Testing tikwm download proxy...\n');

  // Test the tikwm proxy URL
  const downloadUrl = `https://www.tikwm.com/video/media/hdplay/${videoId}.mp4`;
  console.log('📎 Download URL:', downloadUrl);

  try {
    console.log('⏳ Downloading video...');
    
    const response = await axios({
      method: 'GET',
      url: downloadUrl,
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.tikwm.com/',
        'Accept': '*/*'
      },
      timeout: 60000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    const filename = `tiktok_test_${videoId}.mp4`;
    fs.writeFileSync(filename, response.data);

    const stats = fs.statSync(filename);
    console.log('');
    console.log('✅ Downloaded successfully!');
    console.log('📁 Saved to:', filename);
    console.log('📊 File size:', (stats.size / 1024 / 1024).toFixed(2) + ' MB');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
    }
  }
}

testDownload();
