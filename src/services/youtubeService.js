import axios from 'axios';

/**
 * YouTube Audio Download Service
 * Extracts audio from YouTube videos using cobalt API
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
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
  
  const services = [
    // Service 1: Cobalt API (self-hosted instances)
    async () => {
      const cobaltInstances = [
        'https://api.cobalt.tools',
        'https://cobalt-api.hyper.lol',
        'https://cobalt.api.timelessnesses.me'
      ];
      
      for (const instance of cobaltInstances) {
        try {
          const response = await axios.post(`${instance}/api/json`, {
            url: youtubeUrl,
            aFormat: 'mp3',
            isAudioOnly: true,
            audioBitrate: '128'
          }, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            timeout: 20000
          });

          if (response.data?.url) {
            return { url: response.data.url, source: 'cobalt' };
          }
        } catch (e) {
          continue;
        }
      }
      throw new Error('Cobalt failed');
    },

    // Service 2: y2meta API
    async () => {
      const analyzeRes = await axios.post('https://www.y2meta.com/mates/analyzeV2/ajax',
        new URLSearchParams({
          k_query: youtubeUrl,
          k_page: 'home',
          hl: 'en',
          q_auto: '0'
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          timeout: 15000
        }
      );

      if (analyzeRes.data?.links?.mp3) {
        const mp3Links = analyzeRes.data.links.mp3;
        const quality = Object.keys(mp3Links).find(k => k.includes('128')) || Object.keys(mp3Links)[0];
        
        if (mp3Links[quality]?.k) {
          const convertRes = await axios.post('https://www.y2meta.com/mates/convertV2/index',
            new URLSearchParams({
              vid: videoId,
              k: mp3Links[quality].k
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
            return { url: convertRes.data.dlink, source: 'y2meta' };
          }
        }
      }
      throw new Error('y2meta failed');
    },

    // Service 3: y2mate.nu API
    async () => {
      const response = await axios.post('https://www.y2mate.nu/api/convert',
        {
          url: youtubeUrl,
          format: 'mp3',
          quality: '128'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          timeout: 30000
        }
      );

      if (response.data?.downloadUrl) {
        return { url: response.data.downloadUrl, source: 'y2mate.nu' };
      }
      throw new Error('y2mate.nu failed');
    },

    // Service 4: savemp3 API
    async () => {
      const response = await axios.get(`https://api.savemp3.cc/api/convert?url=${encodeURIComponent(youtubeUrl)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 25000
      });

      if (response.data?.url) {
        return { url: response.data.url, source: 'savemp3' };
      }
      throw new Error('savemp3 failed');
    },

    // Service 5: mp3download.to style
    async () => {
      const response = await axios.get(`https://api.mp3download.to/v1/youtube/video?url=${encodeURIComponent(youtubeUrl)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 25000
      });

      if (response.data?.download?.mp3) {
        return { url: response.data.download.mp3, source: 'mp3download.to' };
      }
      throw new Error('mp3download.to failed');
    }
  ];

  // Try each service until one works
  const errors = [];
  for (const service of services) {
    try {
      const result = await service();
      if (result?.url) {
        console.log(`YouTube audio extracted via ${result.source}`);
        return result;
      }
    } catch (err) {
      errors.push(err.message);
      continue;
    }
  }

  throw new Error(`Unable to extract audio. Errors: ${errors.join(', ')}`);
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
