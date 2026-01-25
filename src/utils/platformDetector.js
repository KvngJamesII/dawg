/**
 * Detects the social media platform from a URL
 * @param {string} url - The URL to analyze
 * @returns {string|null} - Platform name or null if not supported
 */
export const detectPlatform = (url) => {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const urlLower = url.toLowerCase();

  // TikTok patterns
  if (
    urlLower.includes('tiktok.com') ||
    urlLower.includes('vm.tiktok.com') ||
    urlLower.includes('vt.tiktok.com')
  ) {
    return 'tiktok';
  }

  // Instagram patterns
  if (urlLower.includes('instagram.com')) {
    return 'instagram';
  }

  // Twitter/X patterns
  if (urlLower.includes('twitter.com') || urlLower.includes('x.com')) {
    return 'twitter';
  }

  return null;
};

/**
 * Validates if a URL is supported
 * @param {string} url - The URL to validate
 * @returns {boolean}
 */
export const isSupported = (url) => {
  return detectPlatform(url) !== null;
};

/**
 * Get platform-specific URL patterns
 */
export const platformPatterns = {
  tiktok: {
    video: /tiktok\.com\/@[\w.-]+\/video\/(\d+)/,
    shortLink: /(vm|vt)\.tiktok\.com\/[\w]+/
  },
  instagram: {
    reel: /instagram\.com\/reel\/([\w-]+)/,
    post: /instagram\.com\/p\/([\w-]+)/,
    tv: /instagram\.com\/tv\/([\w-]+)/
  },
  twitter: {
    status: /(twitter|x)\.com\/\w+\/status\/(\d+)/
  }
};
