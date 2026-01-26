import { Link } from 'react-router-dom'
import { 
  Zap, 
  Download, 
  Shield, 
  Clock, 
  Code2, 
  ArrowRight,
  CheckCircle,
  Play,
  Music
} from 'lucide-react'

export default function Home() {
  const features = [
    {
      icon: Download,
      title: 'TikTok Downloads',
      description: 'Download TikTok videos without watermark in HD quality. Get video info, thumbnails, and more.'
    },
    {
      icon: Music,
      title: 'YouTube Audio',
      description: 'Extract high-quality audio from any YouTube video. Perfect for music apps and audio processing.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Our APIs respond in milliseconds. Built on high-performance infrastructure worldwide.'
    },
    {
      icon: Shield,
      title: 'Reliable & Secure',
      description: '99.9% uptime guarantee with secure HTTPS endpoints and encrypted API keys.'
    },
    {
      icon: Code2,
      title: 'Easy Integration',
      description: 'Simple REST APIs with comprehensive documentation. Works with any programming language.'
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Our servers run around the clock. Get support via Telegram anytime you need help.'
    }
  ]

  const codeExample = `// Download TikTok Video
const response = await fetch(
  'https://api.idledeveloper.tech/api/tiktok?url=VIDEO_URL',
  { headers: { 'X-API-Key': 'YOUR_API_KEY' } }
);

const data = await response.json();
console.log(data.data.video.noWatermark);`

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-dark-900 to-purple-600/10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-dark-800/50 border border-dark-700 rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-300">All systems operational</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Powerful APIs for
              <br />
              <span className="gradient-text">Social Media Downloads</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Download TikTok videos without watermark and extract YouTube audio with our fast, 
              reliable, and affordable API. Start with 25 free credits.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-4 gradient-bg text-white rounded-xl font-semibold btn-hover flex items-center space-x-2"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/docs"
                className="px-8 py-4 bg-dark-800 border border-dark-700 text-white rounded-xl font-semibold hover:bg-dark-700 transition flex items-center space-x-2"
              >
                <Code2 className="w-5 h-5" />
                <span>View Documentation</span>
              </Link>
            </div>

            <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>25 Free Credits</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Instant Access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API Preview */}
      <section className="py-20 bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Simple Integration, <span className="gradient-text">Powerful Results</span>
              </h2>
              <p className="text-gray-400 mb-8">
                Our APIs are designed for developers. Get up and running in minutes with 
                our clean RESTful endpoints and comprehensive documentation.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full gradient-bg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">RESTful JSON API</h4>
                    <p className="text-sm text-gray-400">Clean, predictable endpoints that return JSON</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full gradient-bg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Works Everywhere</h4>
                    <p className="text-sm text-gray-400">Use with any language - JavaScript, Python, PHP, and more</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full gradient-bg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Detailed Responses</h4>
                    <p className="text-sm text-gray-400">Get video info, thumbnails, author details, and download URLs</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-xs text-gray-400 ml-2">example.js</span>
              </div>
              <pre className="text-sm text-gray-300 overflow-x-auto">
                <code>{codeExample}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Built for developers who need reliable, fast, and easy-to-use APIs for social media content.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="bg-dark-800 border border-dark-700 rounded-2xl p-6 card-hover"
                >
                  <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-400">
              Pay only for what you use. No subscriptions, no hidden fees.
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <div className="bg-dark-800 border-2 border-primary-500 rounded-2xl p-8 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Pay As You Go</h3>
                <div className="flex items-baseline justify-center mb-4">
                  <span className="text-5xl font-bold text-white">$2</span>
                  <span className="text-gray-400 ml-2">/ 5,000 credits</span>
                </div>
                <p className="text-gray-400 mb-6">1 credit = 1 successful API request</p>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center space-x-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>25 free credits to start</span>
                  </li>
                  <li className="flex items-center space-x-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>TikTok & YouTube API access</span>
                  </li>
                  <li className="flex items-center space-x-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>No expiration on credits</span>
                  </li>
                  <li className="flex items-center space-x-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Priority Telegram support</span>
                  </li>
                </ul>
                <Link
                  to="/register"
                  className="block w-full py-4 gradient-bg text-white rounded-xl font-semibold btn-hover"
                >
                  Start Free Trial
                </Link>
              </div>
            </div>
          </div>

          <p className="text-center text-gray-400 mt-8">
            View all pricing plans on our{' '}
            <Link to="/pricing" className="text-primary-400 hover:text-primary-300">
              pricing page
            </Link>
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Join hundreds of developers using our APIs. Sign up now and get 25 free credits to test our services.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-gray-100 transition"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
