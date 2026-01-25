# 🎬 Social Media Video Downloader API

A powerful REST API to download videos from TikTok, Instagram Reels, and Twitter/X without watermarks.

## Features

- ✅ **TikTok** - Download videos without watermark
- ✅ **Instagram** - Download Reels and video posts
- ✅ **Twitter/X** - Download videos in multiple qualities
- 🔒 Rate limiting protection
- 🛡️ Input validation with Zod
- 🚀 Fast and lightweight

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

### 3. Start the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The API will be running at `http://localhost:3000`

## API Endpoints

### Universal Download

Auto-detects the platform and downloads the video.

```http
POST /api/download
Content-Type: application/json

{
  "url": "https://www.tiktok.com/@username/video/1234567890"
}
```

### Platform-Specific Endpoints

#### TikTok
```http
POST /api/tiktok
Content-Type: application/json

{
  "url": "https://www.tiktok.com/@username/video/1234567890"
}
```

#### Instagram
```http
POST /api/instagram
Content-Type: application/json

{
  "url": "https://www.instagram.com/reel/XXXXXXXXXXX/"
}
```

#### Twitter/X
```http
POST /api/twitter
Content-Type: application/json

{
  "url": "https://twitter.com/username/status/1234567890"
}
```

### List Supported Platforms
```http
GET /api/platforms
```

### Health Check
```http
GET /health
```

## Response Format

### Success Response

```json
{
  "success": true,
  "platform": "tiktok",
  "data": {
    "videoId": "1234567890",
    "author": "username",
    "description": "Video description",
    "thumbnail": "https://...",
    "video": {
      "noWatermark": "https://...",
      "watermark": "https://..."
    },
    "downloadUrls": {
      "noWatermark": "https://...",
      "watermark": "https://..."
    }
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message here"
}
```

## Supported URL Formats

### TikTok
- `https://www.tiktok.com/@username/video/1234567890`
- `https://vm.tiktok.com/XXXXXXXX/`
- `https://vt.tiktok.com/XXXXXXXX/`

### Instagram
- `https://www.instagram.com/reel/XXXXXXXXXXX/`
- `https://www.instagram.com/p/XXXXXXXXXXX/`

### Twitter/X
- `https://twitter.com/username/status/1234567890`
- `https://x.com/username/status/1234567890`

## Example Usage

### cURL

```bash
# Download TikTok video
curl -X POST http://localhost:3000/api/download \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.tiktok.com/@user/video/123"}'

# Download Instagram Reel
curl -X POST http://localhost:3000/api/instagram \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.instagram.com/reel/ABC123/"}'
```

### JavaScript (fetch)

```javascript
const response = await fetch('http://localhost:3000/api/download', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://www.tiktok.com/@user/video/123'
  })
});

const data = await response.json();
console.log(data.data.downloadUrls.noWatermark);
```

### Python (requests)

```python
import requests

response = requests.post(
    'http://localhost:3000/api/download',
    json={'url': 'https://www.tiktok.com/@user/video/123'}
)

data = response.json()
print(data['data']['downloadUrls']['noWatermark'])
```

## Rate Limiting

By default, the API allows:
- **100 requests** per **15 minutes** per IP

Configure in `.env`:
```env
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Error Codes

| Status | Description |
|--------|-------------|
| 400 | Invalid URL or validation error |
| 403 | Content is private or restricted |
| 404 | Content not found or deleted |
| 429 | Rate limit exceeded |
| 500 | Server error |
| 503 | Platform unreachable |

## Project Structure

```
├── src/
│   ├── controllers/
│   │   └── downloadController.js
│   ├── services/
│   │   ├── tiktokService.js
│   │   ├── instagramService.js
│   │   └── twitterService.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── validateRequest.js
│   ├── validators/
│   │   └── downloadSchema.js
│   ├── utils/
│   │   ├── platformDetector.js
│   │   └── helpers.js
│   ├── routes/
│   │   └── index.js
│   └── server.js
├── .env
├── .env.example
├── package.json
└── README.md
```

## Disclaimer

This API is for educational purposes only. Respect the terms of service of each platform. Do not use this for:
- Downloading copyrighted content without permission
- Mass scraping or abuse
- Commercial purposes without proper licensing

## License

MIT
