import axios from 'axios';

/**
 * YouTube Audio Download Service
 * Extracts audio from YouTube videos using reliable APIs
 */

// Extract video ID from various YouTube URL formats
function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/  // Direct video ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Get video metadata from YouTube oEmbed (free, no API key)
async function getVideoMetadata(videoId) {
  try {
    const response = await axios.get(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
      { timeout: 10000 }
    );
    
    return {
      title: response.data.title,
      author: response.data.author_name,
      authorUrl: response.data.author_url,
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      thumbnailHq: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    };
  } catch (err) {
    return {
      title: 'Unknown',
      author: 'Unknown',
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    };
  }
}

// Try multiple services to get audio URL
async function getAudioUrl(videoId) {
  const services = [
    // Service 1: cn.downloader.to (very reliable)
    async () => {
      // Step 1: Analyze video
      const analyzeRes = await axios.post('https://ab.cococococ.com/ajax/download.php', 
        new URLSearchParams({
          url: `https://www.youtube.com/watch?v=${videoId}`,
          format: 'mp3',
          quality: '128'
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Origin': 'https://ytmp3.cc',
            'Referer': 'https://ytmp3.cc/'
          },
          timeout: 20000
        }
      );
      
      if (analyzeRes.data?.url) {
        return { url: analyzeRes.data.url, source: 'cococococ' };
      }
      throw new Error('No audio URL');
    },

    // Service 2: Use onlinevideoconverter style API
    async () => {
      const response = await axios.get(`https://p.oceansaver.in/ajax/download.php?format=mp3&url=https://www.youtube.com/watch?v=${videoId}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 20000
      });
      
      if (response.data?.url) {
        return { url: response.data.url, source: 'oceansaver' };
      }
      throw new Error('No audio URL');
    },

    // Service 3: Use 9convert style
    async () => {
      const formData = new URLSearchParams();
      formData.append('url', `https://www.youtube.com/watch?v=${videoId}`);
      formData.append('format', 'mp3');
      
      const response = await axios.post('https://9convert.com/api/ajaxSearch/index', formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 15000
      });
      
      if (response.data?.links?.mp3) {
        const mp3Data = response.data.links.mp3;
        const key = Object.keys(mp3Data)[0];
        if (mp3Data[key]?.k) {
          // Get download link
          const convertRes = await axios.post('https://9convert.com/api/ajaxConvert/convert',
            new URLSearchParams({
              vid: videoId,
              k: mp3Data[key].k
            }).toString(),
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
              },
              timeout: 30000
            }
          );
          
          if (convertRes.data?.dlink) {
            return { url: convertRes.data.dlink, source: '9convert' };
          }
        }
      }
      throw new Error('No audio URL');
    },

    // Service 4: tomp3.cc API
    async () => {
      const response = await axios.post('https://tomp3.cc/api/ajax/search',
        new URLSearchParams({
          query: `https://www.youtube.com/watch?v=${videoId}`,
          vt: 'mp3'
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          timeout: 15000
        }
      );
      
      if (response.data?.links?.mp3?.mp3128?.k) {
        const convertRes = await axios.post('https://tomp3.cc/api/ajax/convert',
          new URLSearchParams({
            vid: videoId,
            k: response.data.links.mp3.mp3128.k
          }).toString(),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 30000
          }
        );
        
        if (convertRes.data?.dlink) {
          return { url: convertRes.data.dlink, source: 'tomp3.cc' };
        }
      }
      throw new Error('No audio URL');
    },

    // Service 5: yt5s.io API
    async () => {
      const response = await axios.post('https://yt5s.io/api/ajaxSearch',
        new URLSearchParams({
          q: `https://www.youtube.com/watch?v=${videoId}`,
          vt: 'mp3'
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          timeout: 15000
        }
      );
      
      if (response.data?.links?.mp3) {
        const mp3Links = response.data.links.mp3;
        const firstKey = Object.keys(mp3Links)[0];
        
        if (mp3Links[firstKey]?.k) {
          const convertRes = await axios.post('https://cv.yt5s.io/api/ajaxConvert',
            new URLSearchParams({
              vid: videoId,
              k: mp3Links[firstKey].k
            }).toString(),
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
              },
              timeout: 30000
            }
          );
          
          if (convertRes.data?.dlink) {
            return { url: convertRes.data.dlink, source: 'yt5s' };
          }
        }
      }
      throw new Error('No audio URL');
    }
  ];

  // Try each service until one works
  for (const service of services) {
    try {
      const result = await service();
      if (result?.url) {
        console.log(`YouTube audio extracted via ${result.source}`);
        return result;
      }
    } catch (err) {
      console.log(`Service failed: ${err.message}`);
      continue;
    }
  }

  throw new Error('Unable to extract audio from this video. All services failed.');
}

export async function downloadYouTubeAudio(url) {
  const videoId = extractVideoId(url);
  
  if (!videoId) {
    throw new Error('Invalid YouTube URL');
  }

  // Get metadata first
  const metadata = await getVideoMetadata(videoId);
  
  // Then try to get audio URL
  const audioInfo = await getAudioUrl(videoId);

  return {
    videoId,
    title: metadata.title,
    author: metadata.author,
    authorUrl: metadata.authorUrl,
    thumbnail: metadata.thumbnail,
    thumbnailHq: metadata.thumbnailHq,
    audio: {
      url: audioInfo.url,
      format: 'mp3',
      source: audioInfo.source
    },
    originalUrl: `https://www.youtube.com/watch?v=${videoId}`
  };
}

export function isYouTubeUrl(url) {
  return /(?:youtube\.com|youtu\.be)/i.test(url);
}
