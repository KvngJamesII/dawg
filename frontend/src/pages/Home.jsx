import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { 
  ArrowRight, 
  Zap, 
  Shield, 
  Code2, 
  Download,
  Youtube,
  Clock,
  CheckCircle2,
  Copy,
  Terminal,
  Globe,
  BarChart3,
  Lock,
  Sparkles,
  ChevronRight,
  Star
} from 'lucide-react'
import { useState } from 'react'

export default function Home() {
  const { theme } = useTheme()
  const [copiedCode, setCopiedCode] = useState(false)
  const [activeTab, setActiveTab] = useState('tiktok')
  const isDark = theme === 'dark'

  const copyCode = () => {
    const code = activeTab === 'tiktok' 
      ? `curl -X GET "https://api.idledeveloper.tech/api/tiktok?url=VIDEO_URL" \\
  -H "X-API-Key: YOUR_API_KEY"`
      : `curl -X GET "https://api.idledeveloper.tech/api/youtube?url=VIDEO_URL" \\
  -H "X-API-Key: YOUR_API_KEY"`
    navigator.clipboard.writeText(code)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const apis = [
    {
      id: 'tiktok',
      name: 'TikTok API',
      description: 'Download videos without watermark',
      icon: Download,
      color: 'from-pink-500 to-rose-500',
      badge: 'Popular'
    },
    {
      id: 'youtube',
      name: 'YouTube API',
      description: 'Extract high-quality audio',
      icon: Youtube,
      color: 'from-red-500 to-orange-500',
      badge: 'New'
    },
    {
      id: 'instagram',
      name: 'Instagram API',
      description: 'Download reels and stories',
      icon: Globe,
      color: 'from-purple-500 to-pink-500',
      badge: 'Coming Soon'
    },
    {
      id: 'twitter',
      name: 'Twitter/X API',
      description: 'Download videos and media',
      icon: Globe,
      color: 'from-blue-500 to-cyan-500',
      badge: 'Coming Soon'
    }
  ]

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Average response time under 500ms. Our infrastructure is optimized for speed and reliability.',
      color: 'text-yellow-400'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: '99.9% uptime with HTTPS encryption. Your API keys are securely stored and never exposed.',
      color: 'text-emerald-400'
    },
    {
      icon: Code2,
      title: 'Simple Integration',
      description: 'RESTful JSON API that works with any language. Comprehensive docs with code examples.',
      color: 'text-blue-400'
    },
    {
      icon: BarChart3,
      title: 'Usage Analytics',
      description: 'Track your API usage in real-time with detailed analytics and insights.',
      color: 'text-purple-400'
    },
    {
      icon: Lock,
      title: 'Rate Limiting',
      description: 'Built-in rate limiting to protect your applications and ensure fair usage.',
      color: 'text-orange-400'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Get help when you need it via Telegram. We typically respond within minutes.',
      color: 'text-cyan-400'
    }
  ]

  const stats = [
    { value: '10M+', label: 'API Requests' },
    { value: '1,000+', label: 'Developers' },
    { value: '99.9%', label: 'Uptime' },
    { value: '<500ms', label: 'Response Time' }
  ]

  const testimonials = [
    {
      quote: "The API is incredibly fast and reliable. We've integrated it into our app and haven't looked back.",
      author: "Alex Chen",
      role: "Full Stack Developer",
      avatar: "A"
    },
    {
      quote: "Best video download API I've used. The documentation is clear and the support is excellent.",
      author: "Sarah Johnson",
      role: "Mobile Developer",
      avatar: "S"
    },
    {
      quote: "Simple pricing, great performance. Exactly what we needed for our project.",
      author: "Mike Williams",
      role: "Tech Lead",
      avatar: "M"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-20 pb-20 sm:pb-32 overflow-hidden">
        {/* Background Effects */}
        <div className={`absolute inset-0 ${isDark ? 'bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)]'} bg-[size:64px_64px]`} />
        <div className="absolute top-0 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          {/* Status Badge */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className={`inline-flex items-center gap-2 backdrop-blur border rounded-full px-3 sm:px-4 py-2 ${
              isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white/80 border-zinc-200'
            }`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className={`text-xs sm:text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>All systems operational</span>
              <ChevronRight className={`w-4 h-4 ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`} />
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className={`text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-4 sm:mb-6 ${
              isDark ? 'text-white' : 'text-zinc-900'
            }`}>
              Powerful APIs for
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400">
                Modern Developers
              </span>
            </h1>
            
            <p className={`text-base sm:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4 ${
              isDark ? 'text-zinc-400' : 'text-zinc-600'
            }`}>
              Build amazing applications with our suite of APIs. Download TikTok videos, extract YouTube audio, and more. 
              Simple integration, transparent pricing, world-class reliability.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
              <Link to="/register" className={`group w-full sm:w-auto font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all duration-200 inline-flex items-center justify-center gap-2 text-sm sm:text-base ${
                isDark ? 'bg-white hover:bg-zinc-100 text-black' : 'bg-black hover:bg-zinc-800 text-white'
              }`}>
                Start Building Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/docs" className={`w-full sm:w-auto font-medium px-6 sm:px-8 py-3 sm:py-4 rounded-xl border transition-all duration-200 inline-flex items-center justify-center gap-2 text-sm sm:text-base ${
                isDark 
                  ? 'bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-800 hover:border-zinc-700' 
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border-zinc-200 hover:border-zinc-300'
              }`}>
                <Code2 className="w-5 h-5" />
                View Documentation
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className={`mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-3 text-xs sm:text-sm ${
              isDark ? 'text-zinc-500' : 'text-zinc-600'
            }`}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-500" />
                <span>25 Free Credits</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-500" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-500" />
                <span>Instant API Access</span>
              </div>
            </div>
          </div>

          {/* Code Preview */}
          <div className="mt-12 sm:mt-20 max-w-3xl mx-auto px-4">
            <div className={`backdrop-blur border rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl ${
              isDark ? 'bg-black/80 border-zinc-800' : 'bg-zinc-900 border-zinc-700'
            }`}>
              {/* Tab Bar */}
              <div className={`flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b ${
                isDark ? 'border-zinc-800 bg-zinc-900/50' : 'border-zinc-700 bg-zinc-800/50'
              }`}>
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-zinc-500" />
                  <span className="text-xs sm:text-sm text-zinc-500 font-mono hidden sm:inline">Quick Start</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('tiktok')}
                    className={`px-2 sm:px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      activeTab === 'tiktok' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    TikTok
                  </button>
                  <button
                    onClick={() => setActiveTab('youtube')}
                    className={`px-2 sm:px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      activeTab === 'youtube' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    YouTube
                  </button>
                  <button 
                    onClick={copyCode}
                    className="ml-2 text-zinc-500 hover:text-white transition-colors p-1"
                  >
                    {copiedCode ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <pre className="p-4 sm:p-6 text-xs sm:text-sm overflow-x-auto">
                <code className="text-zinc-300">
                  <span className="text-emerald-400">curl</span> -X GET <span className="text-amber-300">"https://api.idledeveloper.tech/api/{activeTab}?url=VIDEO_URL"</span> \{'\n'}
                  {'  '}-H <span className="text-amber-300">"X-API-Key: YOUR_API_KEY"</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-12 sm:py-16 border-y ${
        isDark ? 'border-zinc-900 bg-zinc-900/30' : 'border-zinc-200 bg-zinc-50'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 ${
                  isDark ? 'text-white' : 'text-zinc-900'
                }`}>{stat.value}</div>
                <div className={`text-xs sm:text-sm ${isDark ? 'text-zinc-500' : 'text-zinc-600'}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APIs Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-500 text-sm font-medium px-3 py-1 rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              Our APIs
            </div>
            <h2 className={`text-2xl sm:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Everything you need to build
            </h2>
            <p className={`max-w-xl mx-auto text-base sm:text-lg ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              A growing collection of powerful APIs designed for developers. Start with what you need, scale as you grow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {apis.map((api) => (
              <div 
                key={api.id}
                className={`group relative p-5 sm:p-6 rounded-xl sm:rounded-2xl border transition-all duration-300 ${
                  api.badge === 'Coming Soon' 
                    ? isDark 
                      ? 'border-zinc-800/50 bg-zinc-900/20 opacity-60' 
                      : 'border-zinc-200/50 bg-zinc-100/50 opacity-60'
                    : isDark
                      ? 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900/80 cursor-pointer'
                      : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-lg cursor-pointer'
                }`}
              >
                {api.badge && (
                  <div className={`absolute top-3 sm:top-4 right-3 sm:right-4 text-xs font-medium px-2 py-1 rounded-full ${
                    api.badge === 'Popular' 
                      ? 'bg-emerald-500/20 text-emerald-500' 
                      : api.badge === 'New'
                      ? 'bg-blue-500/20 text-blue-500'
                      : isDark ? 'bg-zinc-800 text-zinc-500' : 'bg-zinc-200 text-zinc-500'
                  }`}>
                    {api.badge}
                  </div>
                )}
                <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r ${api.color} flex items-center justify-center mb-3 sm:mb-4`}>
                  <api.icon className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                </div>
                <h3 className={`text-base sm:text-lg font-semibold mb-1 sm:mb-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>{api.name}</h3>
                <p className={`text-xs sm:text-sm ${isDark ? 'text-zinc-500' : 'text-zinc-600'}`}>{api.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-16 sm:py-24 border-t ${isDark ? 'border-zinc-900' : 'border-zinc-200'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className={`text-2xl sm:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Built for developers
            </h2>
            <p className={`max-w-lg mx-auto text-base sm:text-lg ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Everything you need to integrate our APIs into your application with confidence.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {features.map((feature, index) => (
              <div key={index} className={`group p-5 sm:p-6 rounded-xl sm:rounded-2xl border transition-all duration-300 ${
                isDark 
                  ? 'border-zinc-800/50 hover:border-zinc-700 bg-zinc-900/20 hover:bg-zinc-900/40' 
                  : 'border-zinc-200 hover:border-zinc-300 bg-white hover:shadow-lg'
              }`}>
                <feature.icon className={`w-7 sm:w-8 h-7 sm:h-8 ${feature.color} mb-3 sm:mb-4`} />
                <h3 className={`text-base sm:text-lg font-semibold mb-1 sm:mb-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>{feature.title}</h3>
                <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-zinc-500' : 'text-zinc-600'}`}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={`py-16 sm:py-24 border-t ${isDark ? 'border-zinc-900' : 'border-zinc-200'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className={`text-2xl sm:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Loved by developers
            </h2>
            <p className={`max-w-lg mx-auto text-base sm:text-lg ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Join thousands of developers who trust our APIs for their applications.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className={`p-5 sm:p-6 rounded-xl sm:rounded-2xl border ${
                isDark ? 'border-zinc-800 bg-zinc-900/30' : 'border-zinc-200 bg-white'
              }`}>
                <div className="flex gap-1 mb-3 sm:mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className={`mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                    <span className="text-white font-medium text-sm">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <div className={`font-medium text-sm ${isDark ? 'text-white' : 'text-zinc-900'}`}>{testimonial.author}</div>
                    <div className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-600'}`}>{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className={`py-16 sm:py-24 border-t ${isDark ? 'border-zinc-900' : 'border-zinc-200'}`} id="pricing">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className={`text-2xl sm:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Simple, transparent pricing
            </h2>
            <p className={`text-base sm:text-lg ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Pay only for what you use. No subscriptions, no hidden fees.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className={`relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 overflow-hidden ${
              isDark 
                ? 'bg-gradient-to-b from-zinc-900 to-zinc-900/50 border border-zinc-800' 
                : 'bg-white border border-zinc-200 shadow-xl'
            }`}>
              {/* Glow Effect */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-500/20 blur-3xl" />
              
              <div className="relative text-center">
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-500 text-sm font-medium px-3 py-1 rounded-full mb-4 sm:mb-6">
                  <Zap className="w-4 h-4" />
                  Most Popular
                </div>
                
                <div className="mb-4 sm:mb-6">
                  <span className={`text-4xl sm:text-6xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>$2</span>
                  <span className={`ml-2 text-base sm:text-lg ${isDark ? 'text-zinc-500' : 'text-zinc-600'}`}>/ 5,000 credits</span>
                </div>
                
                <p className={`mb-6 sm:mb-8 text-sm sm:text-base ${isDark ? 'text-zinc-500' : 'text-zinc-600'}`}>
                  1 credit = 1 API request
                </p>

                <ul className="space-y-3 sm:space-y-4 text-left mb-6 sm:mb-8">
                  {[
                    '25 free credits to start',
                    'Access to all APIs',
                    'Credits never expire',
                    'Priority support',
                    'Detailed analytics',
                    'No rate limits'
                  ].map((item, i) => (
                    <li key={i} className={`flex items-center gap-3 text-sm sm:text-base ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Link 
                  to="/register" 
                  className="block w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 sm:py-4 rounded-xl transition-all duration-200 text-sm sm:text-base"
                >
                  Get Started Free
                </Link>
                
                <p className={`mt-3 sm:mt-4 text-xs sm:text-sm ${isDark ? 'text-zinc-500' : 'text-zinc-600'}`}>
                  No credit card required
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-16 sm:py-24 border-t ${isDark ? 'border-zinc-900' : 'border-zinc-200'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className={`relative rounded-2xl sm:rounded-3xl p-8 sm:p-12 border overflow-hidden ${
            isDark 
              ? 'bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-purple-500/10 border-zinc-800' 
              : 'bg-gradient-to-r from-emerald-500/5 via-cyan-500/5 to-purple-500/5 border-zinc-200'
          }`}>
            <div className={`absolute inset-0 ${
              isDark 
                ? 'bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]' 
                : 'bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)]'
            } bg-[size:32px_32px]`} />
            
            <div className="relative">
              <h2 className={`text-2xl sm:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                Ready to start building?
              </h2>
              <p className={`mb-6 sm:mb-8 text-base sm:text-lg max-w-xl mx-auto ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Create your account now and get 25 free credits to test our APIs. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Link 
                  to="/register" 
                  className={`group w-full sm:w-auto font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all duration-200 inline-flex items-center justify-center gap-2 text-sm sm:text-base ${
                    isDark ? 'bg-white hover:bg-zinc-100 text-black' : 'bg-black hover:bg-zinc-800 text-white'
                  }`}
                >
                  Create Free Account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/docs" 
                  className={`font-medium transition-colors inline-flex items-center gap-2 text-sm sm:text-base ${
                    isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  Read the docs
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
