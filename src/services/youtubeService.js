import axios from 'axios';

/**
 * YouTube Audio Download Service
 * Extracts audio from YouTube videos
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

// Get video info and audio URL using a reliable API
async function getVideoInfo(videoId) {
  // Using a public API endpoint for YouTube info
  const apiUrl = `https://yt-api.p.rapidapi.com/dl?id=${videoId}`;
  
  try {
    // Try cobalt.tools API first (free, no key needed)
    const cobaltResponse = await axios.post('https://api.cobalt.tools/api/json', {
      url: `https://www.youtube.com/watch?v=${videoId}`,
      vCodec: 'h264',
      vQuality: '720',
      aFormat: 'mp3',
      isAudioOnly: true,
      disableMetadata: false
    }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });

    if (cobaltResponse.data && cobaltResponse.data.url) {
      return {
        source: 'cobalt',
        audioUrl: cobaltResponse.data.url,
        videoId
      };
    }
  } catch (err) {
    console.log('Cobalt API failed, trying fallback...');
  }

  // Fallback: Try y2mate-type API
  try {
    const response = await axios.get(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`, {
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '',
        'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
      },
      timeout: 15000
    });

    if (response.data && response.data.link) {
      return {
        source: 'rapidapi',
        title: response.data.title,
        audioUrl: response.data.link,
        duration: response.data.duration,
        videoId
      };
    }
  } catch (err) {
    console.log('RapidAPI failed, trying another fallback...');
  }

  // Fallback 2: Use yt-download API
  try {
    const response = await axios.get(`https://yt-download.org/api/button/mp3/${videoId}`, {
      timeout: 15000
    });
    
    // Parse the response for download link
    const linkMatch = response.data.match(/href="(https:\/\/[^"]+\.mp3[^"]*)"/);
    if (linkMatch) {
      return {
        source: 'yt-download',
        audioUrl: linkMatch[1],
        videoId
      };
    }
  } catch (err) {
    console.log('yt-download failed...');
  }

  // Fallback 3: Use a scraping approach with ytdl proxy
  try {
    const response = await axios.get(`https://api.vevioz.com/api/button/mp3/${videoId}`, {
      timeout: 15000
    });
    
    const linkMatch = response.data.match(/href="(https:\/\/[^"]+)"/);
    if (linkMatch) {
      return {
        source: 'vevioz',
        audioUrl: linkMatch[1],
        videoId
      };
    }
  } catch (err) {
    console.log('Vevioz failed...');
  }

  throw new Error('Unable to extract audio from this video');
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

export async function downloadYouTubeAudio(url) {
  const videoId = extractVideoId(url);
  
  if (!videoId) {
    throw new Error('Invalid YouTube URL');
  }

  // Get metadata and audio URL in parallel
  const [metadata, audioInfo] = await Promise.all([
    getVideoMetadata(videoId),
    getVideoInfo(videoId)
  ]);

  return {
    videoId,
    title: audioInfo.title || metadata.title,
    author: metadata.author,
    authorUrl: metadata.authorUrl,
    thumbnail: metadata.thumbnail,
    thumbnailHq: metadata.thumbnailHq,
    duration: audioInfo.duration || null,
    audio: {
      url: audioInfo.audioUrl,
      format: 'mp3',
      source: audioInfo.source
    },
    originalUrl: `https://www.youtube.com/watch?v=${videoId}`
  };
}

export function isYouTubeUrl(url) {
  return /(?:youtube\.com|youtu\.be)/i.test(url);
}
