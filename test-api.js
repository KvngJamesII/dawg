// Simple test script for the API

const tests = [
  {
    name: 'TikTok',
    endpoint: '/api/tiktok',
    url: 'https://www.tiktok.com/@rockinrefreshments/video/7381832164662431019'
  },
  {
    name: 'Twitter',
    endpoint: '/api/twitter',
    url: 'https://twitter.com/SpaceX/status/1879719683036856778'
  }
];

async function testAPI() {
  for (const test of tests) {
    try {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`Testing ${test.name} download API...`);
      console.log(`URL: ${test.url}`);
      console.log('='.repeat(60));

      const response = await fetch(`http://localhost:3000${test.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: test.url })
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('\n✅ SUCCESS!\n');
        console.log('Platform:', data.platform);
        console.log('Author:', data.data.author || data.data.authorUsername || 'N/A');
        console.log('Description:', (data.data.description || data.data.text || '').substring(0, 100) + '...');
        
        if (data.data.video?.noWatermark) {
          console.log('\n📥 No Watermark URL:', data.data.video.noWatermark.substring(0, 80) + '...');
        }
        if (data.data.video?.best || data.data.downloadUrls?.best) {
          console.log('📥 Best Quality URL:', (data.data.video?.best || data.data.downloadUrls?.best).substring(0, 80) + '...');
        }
      } else {
        console.log('\n❌ FAILED:', data.error);
      }
    } catch (error) {
      console.error(`\n❌ ERROR testing ${test.name}:`, error.message);
    }
  }
}

testAPI();
