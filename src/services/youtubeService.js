import { exec } from 'child_process';
import { promisify } from 'util';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * YouTube Audio Download Service
 * Uses yt-dlp for reliable extraction
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

// Get audio URL using yt-dlp
async function getAudioUrlWithYtDlp(videoId) {
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
  
  try {
    // Get the best audio URL directly (no download)
    const { stdout } = await execAsync(
      `yt-dlp -f "bestaudio[ext=m4a]/bestaudio" --get-url "${youtubeUrl}"`,
      { timeout: 30000 }
    );
    
    const audioUrl = stdout.trim();
    if (audioUrl && audioUrl.startsWith('http')) {
      return { url: audioUrl, source: 'yt-dlp', format: 'm4a' };
    }
    throw new Error('No audio URL returned');
  } catch (err) {
    console.error('yt-dlp error:', err.message);
    throw new Error(`yt-dlp failed: ${err.message}`);
  }
}

// Get full video info with yt-dlp
async function getVideoInfoWithYtDlp(videoId) {
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
  
  try {
    const { stdout } = await execAsync(
      `yt-dlp -j "${youtubeUrl}"`,
      { timeout: 30000 }
    );
    
    const info = JSON.parse(stdout);
    
    // Find best audio format
    const audioFormats = info.formats?.filter(f => 
      f.acodec !== 'none' && f.vcodec === 'none'
    ) || [];
    
    const bestAudio = audioFormats.sort((a, b) => 
      (b.abr || 0) - (a.abr || 0)
    )[0];
    
    return {
      title: info.title,
      author: info.uploader || info.channel,
      authorUrl: info.uploader_url || info.channel_url,
      duration: info.duration,
      thumbnail: info.thumbnail,
      audioUrl: bestAudio?.url || info.url,
      audioFormat: bestAudio?.ext || 'm4a',
      audioBitrate: bestAudio?.abr
    };
  } catch (err) {
    console.error('yt-dlp info error:', err.message);
    throw err;
  }
}

export async function downloadYouTubeAudio(url) {
  const videoId = extractVideoId(url);
  
  if (!videoId) {
    throw new Error('Invalid YouTube URL');
  }

  try {
    // Try to get full info with yt-dlp
    const info = await getVideoInfoWithYtDlp(videoId);
    
    return {
      videoId,
      title: info.title,
      author: info.author,
      authorUrl: info.authorUrl,
      thumbnail: info.thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      thumbnailHq: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      duration: info.duration,
      audio: {
        url: info.audioUrl,
        format: info.audioFormat,
        bitrate: info.audioBitrate,
        source: 'yt-dlp'
      },
      originalUrl: `https://www.youtube.com/watch?v=${videoId}`
    };
  } catch (err) {
    // Fallback: just get the URL
    const metadata = await getVideoMetadata(videoId);
    const audioInfo = await getAudioUrlWithYtDlp(videoId);
    
    return {
      videoId,
      title: metadata.title,
      author: metadata.author,
      authorUrl: metadata.authorUrl,
      thumbnail: metadata.thumbnail,
      thumbnailHq: metadata.thumbnailHq,
      audio: {
        url: audioInfo.url,
        format: audioInfo.format,
        source: audioInfo.source
      },
      originalUrl: `https://www.youtube.com/watch?v=${videoId}`
    };
  }
}

export function isYouTubeUrl(url) {
  return /(?:youtube\.com|youtu\.be)/i.test(url);
}
