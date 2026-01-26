import { useState } from 'react'
import { 
  Book, 
  Code2, 
  Copy, 
  CheckCircle,
  ChevronRight,
  Play,
  Terminal,
  Globe
} from 'lucide-react'

export default function Docs() {
  const [copiedCode, setCopiedCode] = useState(null)
  const [activeTab, setActiveTab] = useState('tiktok')

  const copyCode = async (code, id) => {
    try {
      await navigator.clipboard.writeText(code)
    } catch (err) {
      const textarea = document.createElement('textarea')
      textarea.value = code
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const CodeBlock = ({ code, language, id }) => (
    <div className="relative bg-dark-900 rounded-xl border border-dark-700 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-dark-700">
        <span className="text-xs text-gray-400">{language}</span>
        <button
          onClick={() => copyCode(code, id)}
          className="p-1 hover:bg-dark-700 rounded transition"
        >
          {copiedCode === id ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm">
        <code className="text-gray-300">{code}</code>
      </pre>
    </div>
  )

  const tiktokExamples = {
    curl: `curl -X GET "https://api.idledeveloper.tech/api/tiktok?url=TIKTOK_VIDEO_URL" \\
  -H "X-API-Key: YOUR_API_KEY"`,
    
    javascript: `// Using Fetch API
const response = await fetch(
  'https://api.idledeveloper.tech/api/tiktok?url=' + encodeURIComponent(videoUrl),
  {
    headers: {
      'X-API-Key': 'YOUR_API_KEY'
    }
  }
);

const data = await response.json();

if (data.success) {
  console.log('Video URL:', data.data.video.noWatermark);
  console.log('Author:', data.data.author.nickname);
}`,

    python: `import requests

url = "https://api.idledeveloper.tech/api/tiktok"
params = {"url": "TIKTOK_VIDEO_URL"}
headers = {"X-API-Key": "YOUR_API_KEY"}

response = requests.get(url, params=params, headers=headers)
data = response.json()

if data["success"]:
    print("Video URL:", data["data"]["video"]["noWatermark"])
    print("Author:", data["data"]["author"]["nickname"])`,

    php: `<?php
$apiKey = "YOUR_API_KEY";
$videoUrl = urlencode("TIKTOK_VIDEO_URL");

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api.idledeveloper.tech/api/tiktok?url=$videoUrl");
curl_setopt($ch, CURLOPT_HTTPHEADER, ["X-API-Key: $apiKey"]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);

if ($data["success"]) {
    echo "Video URL: " . $data["data"]["video"]["noWatermark"];
}
?>`
  }

  const youtubeExamples = {
    curl: `curl -X GET "https://api.idledeveloper.tech/api/youtube?url=YOUTUBE_VIDEO_URL" \\
  -H "X-API-Key: YOUR_API_KEY"`,
    
    javascript: `// Using Fetch API
const response = await fetch(
  'https://api.idledeveloper.tech/api/youtube?url=' + encodeURIComponent(videoUrl),
  {
    headers: {
      'X-API-Key': 'YOUR_API_KEY'
    }
  }
);

const data = await response.json();

if (data.success) {
  console.log('Title:', data.data.title);
  console.log('Audio URL:', data.data.audio.url);
  console.log('Duration:', data.data.duration);
}`,

    python: `import requests

url = "https://api.idledeveloper.tech/api/youtube"
params = {"url": "YOUTUBE_VIDEO_URL"}
headers = {"X-API-Key": "YOUR_API_KEY"}

response = requests.get(url, params=params, headers=headers)
data = response.json()

if data["success"]:
    print("Title:", data["data"]["title"])
    print("Audio URL:", data["data"]["audio"]["url"])`,

    php: `<?php
$apiKey = "YOUR_API_KEY";
$videoUrl = urlencode("YOUTUBE_VIDEO_URL");

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api.idledeveloper.tech/api/youtube?url=$videoUrl");
curl_setopt($ch, CURLOPT_HTTPHEADER, ["X-API-Key: $apiKey"]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);

if ($data["success"]) {
    echo "Title: " . $data["data"]["title"];
    echo "Audio URL: " . $data["data"]["audio"]["url"];
}
?>`
  }

  const examples = activeTab === 'tiktok' ? tiktokExamples : youtubeExamples

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-primary-500/20 text-primary-400 px-4 py-2 rounded-full mb-4">
            <Book className="w-4 h-4" />
            <span className="text-sm font-medium">Documentation</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">API Reference</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Everything you need to integrate our APIs into your application. 
            Simple REST endpoints with JSON responses.
          </p>
        </div>

        {/* Quick Start */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Quick Start</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-dark-900 rounded-xl p-4">
              <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center mb-3">
                <span className="text-primary-400 font-bold">1</span>
              </div>
              <h4 className="text-white font-medium mb-1">Create Account</h4>
              <p className="text-gray-400 text-sm">Sign up and get 25 free credits</p>
            </div>
            <div className="bg-dark-900 rounded-xl p-4">
              <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center mb-3">
                <span className="text-primary-400 font-bold">2</span>
              </div>
              <h4 className="text-white font-medium mb-1">Get API Key</h4>
              <p className="text-gray-400 text-sm">Generate keys for each service</p>
            </div>
            <div className="bg-dark-900 rounded-xl p-4">
              <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center mb-3">
                <span className="text-primary-400 font-bold">3</span>
              </div>
              <h4 className="text-white font-medium mb-1">Make Requests</h4>
              <p className="text-gray-400 text-sm">Start using the API endpoints</p>
            </div>
          </div>
        </div>

        {/* Base URL */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Base URL</h3>
          <div className="flex items-center space-x-3 bg-dark-900 rounded-xl p-4">
            <Globe className="w-5 h-5 text-primary-400" />
            <code className="text-primary-400 flex-1">https://api.idledeveloper.tech</code>
            <button
              onClick={() => copyCode('https://api.idledeveloper.tech', 'baseurl')}
              className="p-2 hover:bg-dark-700 rounded-lg transition"
            >
              {copiedCode === 'baseurl' ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Authentication */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Authentication</h3>
          <p className="text-gray-400 mb-4">
            Include your API key in every request using one of these methods:
          </p>
          <div className="space-y-4">
            <div className="bg-dark-900 rounded-xl p-4">
              <p className="text-sm text-gray-400 mb-2">Header (Recommended)</p>
              <code className="text-primary-400">X-API-Key: YOUR_API_KEY</code>
            </div>
            <div className="bg-dark-900 rounded-xl p-4">
              <p className="text-sm text-gray-400 mb-2">Query Parameter</p>
              <code className="text-primary-400">?key=YOUR_API_KEY</code>
            </div>
          </div>
        </div>

        {/* API Tabs */}
        <div className="flex space-x-1 bg-dark-800 p-1 rounded-xl mb-6 w-fit">
          <button
            onClick={() => setActiveTab('tiktok')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'tiktok'
                ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            TikTok API
          </button>
          <button
            onClick={() => setActiveTab('youtube')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'youtube'
                ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            YouTube API
          </button>
        </div>

        {/* TikTok API */}
        {activeTab === 'tiktok' && (
          <div className="space-y-6">
            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium">GET</span>
                <code className="text-white">/api/tiktok</code>
              </div>
              <p className="text-gray-400 mb-6">
                Download TikTok videos without watermark. Returns video info, author details, and download URLs.
              </p>

              <h4 className="text-white font-medium mb-3">Parameters</h4>
              <div className="bg-dark-900 rounded-xl overflow-hidden mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-dark-700">
                      <th className="text-left p-4 text-gray-400 font-medium">Parameter</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Type</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Required</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-dark-700">
                      <td className="p-4 text-primary-400">url</td>
                      <td className="p-4 text-gray-300">string</td>
                      <td className="p-4"><span className="text-green-400">Yes</span></td>
                      <td className="p-4 text-gray-400">TikTok video URL</td>
                    </tr>
                    <tr>
                      <td className="p-4 text-primary-400">key</td>
                      <td className="p-4 text-gray-300">string</td>
                      <td className="p-4"><span className="text-green-400">Yes</span></td>
                      <td className="p-4 text-gray-400">Your API key</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h4 className="text-white font-medium mb-3">Response</h4>
              <CodeBlock
                id="tiktok-response"
                language="json"
                code={`{
  "success": true,
  "data": {
    "id": "7123456789",
    "title": "Video title",
    "video": {
      "noWatermark": "https://...",
      "watermark": "https://...",
      "cover": "https://..."
    },
    "author": {
      "id": "123456",
      "uniqueId": "username",
      "nickname": "Display Name",
      "avatar": "https://..."
    },
    "stats": {
      "plays": 1000000,
      "likes": 50000,
      "comments": 1000,
      "shares": 500
    }
  }
}`}
              />
            </div>
          </div>
        )}

        {/* YouTube API */}
        {activeTab === 'youtube' && (
          <div className="space-y-6">
            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium">GET</span>
                <code className="text-white">/api/youtube</code>
              </div>
              <p className="text-gray-400 mb-6">
                Extract audio from YouTube videos. Returns video info and audio download URL.
              </p>

              <h4 className="text-white font-medium mb-3">Parameters</h4>
              <div className="bg-dark-900 rounded-xl overflow-hidden mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-dark-700">
                      <th className="text-left p-4 text-gray-400 font-medium">Parameter</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Type</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Required</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-dark-700">
                      <td className="p-4 text-primary-400">url</td>
                      <td className="p-4 text-gray-300">string</td>
                      <td className="p-4"><span className="text-green-400">Yes</span></td>
                      <td className="p-4 text-gray-400">YouTube video URL</td>
                    </tr>
                    <tr>
                      <td className="p-4 text-primary-400">key</td>
                      <td className="p-4 text-gray-300">string</td>
                      <td className="p-4"><span className="text-green-400">Yes</span></td>
                      <td className="p-4 text-gray-400">Your API key</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h4 className="text-white font-medium mb-3">Response</h4>
              <CodeBlock
                id="youtube-response"
                language="json"
                code={`{
  "success": true,
  "data": {
    "id": "dQw4w9WgXcQ",
    "title": "Video Title",
    "thumbnail": "https://...",
    "duration": "3:32",
    "channel": {
      "name": "Channel Name",
      "url": "https://..."
    },
    "audio": {
      "url": "https://...",
      "format": "m4a",
      "quality": "128kbps"
    }
  }
}`}
              />
            </div>
          </div>
        )}

        {/* Code Examples */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 mt-8">
          <h3 className="text-lg font-semibold text-white mb-6">Code Examples</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-white font-medium mb-3 flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-gray-400" />
                <span>cURL</span>
              </h4>
              <CodeBlock id="curl" language="bash" code={examples.curl} />
            </div>

            <div>
              <h4 className="text-white font-medium mb-3 flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-yellow-400" />
                <span>JavaScript</span>
              </h4>
              <CodeBlock id="js" language="javascript" code={examples.javascript} />
            </div>

            <div>
              <h4 className="text-white font-medium mb-3 flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-blue-400" />
                <span>Python</span>
              </h4>
              <CodeBlock id="python" language="python" code={examples.python} />
            </div>

            <div>
              <h4 className="text-white font-medium mb-3 flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-purple-400" />
                <span>PHP</span>
              </h4>
              <CodeBlock id="php" language="php" code={examples.php} />
            </div>
          </div>
        </div>

        {/* Error Codes */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 mt-8">
          <h3 className="text-lg font-semibold text-white mb-6">Error Codes</h3>
          <div className="bg-dark-900 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-700">
                  <th className="text-left p-4 text-gray-400 font-medium">Code</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Message</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-dark-700">
                  <td className="p-4 text-red-400">400</td>
                  <td className="p-4 text-gray-300">Bad Request</td>
                  <td className="p-4 text-gray-400">Missing or invalid URL parameter</td>
                </tr>
                <tr className="border-b border-dark-700">
                  <td className="p-4 text-red-400">401</td>
                  <td className="p-4 text-gray-300">Unauthorized</td>
                  <td className="p-4 text-gray-400">Missing or invalid API key</td>
                </tr>
                <tr className="border-b border-dark-700">
                  <td className="p-4 text-red-400">402</td>
                  <td className="p-4 text-gray-300">Payment Required</td>
                  <td className="p-4 text-gray-400">Insufficient credits</td>
                </tr>
                <tr className="border-b border-dark-700">
                  <td className="p-4 text-red-400">404</td>
                  <td className="p-4 text-gray-300">Not Found</td>
                  <td className="p-4 text-gray-400">Video not found or unavailable</td>
                </tr>
                <tr>
                  <td className="p-4 text-red-400">500</td>
                  <td className="p-4 text-gray-300">Server Error</td>
                  <td className="p-4 text-gray-400">Internal server error</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Support */}
        <div className="bg-gradient-to-r from-primary-600/20 to-purple-600/20 border border-primary-500/30 rounded-2xl p-6 mt-8">
          <h3 className="text-lg font-semibold text-white mb-2">Need Help?</h3>
          <p className="text-gray-400 mb-4">
            If you have questions or run into issues, reach out via Telegram for quick support.
          </p>
          <a
            href="https://t.me/theidledeveloper"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition"
          >
            <span>Contact Support</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  )
}
