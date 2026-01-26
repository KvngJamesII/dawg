import { Link } from 'react-router-dom'
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
  Cpu,
  BarChart3,
  Lock,
  Sparkles,
  ChevronRight,
  Star
} from 'lucide-react'
import { useState } from 'react'

export default function Home() {
  const [copiedCode, setCopiedCode] = useState(false)
  const [activeTab, setActiveTab] = useState('tiktok')

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
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-6xl mx-auto px-6">
          {/* Status Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-full px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-sm text-zinc-400">All systems operational</span>
              <ChevronRight className="w-4 h-4 text-zinc-600" />
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6">
              Powerful APIs for
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400">
                Modern Developers
              </span>
            </h1>
            
            <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Build amazing applications with our suite of APIs. Download TikTok videos, extract YouTube audio, and more. 
              Simple integration, transparent pricing, world-class reliability.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="group bg-white hover:bg-zinc-100 text-black font-semibold px-8 py-4 rounded-xl transition-all duration-200 inline-flex items-center gap-2 text-base">
                Start Building Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/docs" className="bg-zinc-900 hover:bg-zinc-800 text-white font-medium px-8 py-4 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all duration-200 inline-flex items-center gap-2 text-base">
                <Code2 className="w-5 h-5" />
                View Documentation
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-zinc-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>25 Free Credits</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Instant API Access</span>
              </div>
            </div>
          </div>

          {/* Code Preview */}
          <div className="mt-20 max-w-3xl mx-auto">
            <div className="bg-black/80 backdrop-blur border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
              {/* Tab Bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-zinc-500" />
                  <span className="text-sm text-zinc-500 font-mono">Quick Start</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('tiktok')}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      activeTab === 'tiktok' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    TikTok
                  </button>
                  <button
                    onClick={() => setActiveTab('youtube')}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
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
              <pre className="p-6 text-sm overflow-x-auto">
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
      <section className="py-16 border-y border-zinc-900 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APIs Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 text-sm font-medium px-3 py-1 rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              Our APIs
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything you need to build
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto text-lg">
              A growing collection of powerful APIs designed for developers. Start with what you need, scale as you grow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {apis.map((api) => (
              <div 
                key={api.id}
                className={`group relative p-6 rounded-2xl border transition-all duration-300 ${
                  api.badge === 'Coming Soon' 
                    ? 'border-zinc-800/50 bg-zinc-900/20 opacity-60' 
                    : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900/80 cursor-pointer'
                }`}
              >
                {api.badge && (
                  <div className={`absolute top-4 right-4 text-xs font-medium px-2 py-1 rounded-full ${
                    api.badge === 'Popular' 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : api.badge === 'New'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-zinc-800 text-zinc-500'
                  }`}>
                    {api.badge}
                  </div>
                )}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${api.color} flex items-center justify-center mb-4`}>
                  <api.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{api.name}</h3>
                <p className="text-sm text-zinc-500">{api.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Built for developers
            </h2>
            <p className="text-zinc-400 max-w-lg mx-auto text-lg">
              Everything you need to integrate our APIs into your application with confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group p-6 rounded-2xl border border-zinc-800/50 hover:border-zinc-700 bg-zinc-900/20 hover:bg-zinc-900/40 transition-all duration-300">
                <feature.icon className={`w-8 h-8 ${feature.color} mb-4`} />
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Loved by developers
            </h2>
            <p className="text-zinc-400 max-w-lg mx-auto text-lg">
              Join thousands of developers who trust our APIs for their applications.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-zinc-300 mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                    <span className="text-white font-medium">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">{testimonial.author}</div>
                    <div className="text-zinc-500 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-zinc-400 text-lg">
              Pay only for what you use. No subscriptions, no hidden fees.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="relative bg-gradient-to-b from-zinc-900 to-zinc-900/50 border border-zinc-800 rounded-3xl p-8 overflow-hidden">
              {/* Glow Effect */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-500/20 blur-3xl" />
              
              <div className="relative text-center">
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 text-sm font-medium px-3 py-1 rounded-full mb-6">
                  <Zap className="w-4 h-4" />
                  Most Popular
                </div>
                
                <div className="mb-6">
                  <span className="text-6xl font-bold text-white">$2</span>
                  <span className="text-zinc-500 ml-2 text-lg">/ 5,000 credits</span>
                </div>
                
                <p className="text-zinc-500 mb-8">
                  1 credit = 1 API request
                </p>

                <ul className="space-y-4 text-left mb-8">
                  {[
                    '25 free credits to start',
                    'Access to all APIs',
                    'Credits never expire',
                    'Priority support',
                    'Detailed analytics',
                    'No rate limits'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-zinc-300">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Link 
                  to="/register" 
                  className="block w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 rounded-xl transition-all duration-200"
                >
                  Get Started Free
                </Link>
                
                <p className="mt-4 text-sm text-zinc-500">
                  No credit card required
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="relative bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-purple-500/10 rounded-3xl p-12 border border-zinc-800 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />
            
            <div className="relative">
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to start building?
              </h2>
              <p className="text-zinc-400 mb-8 text-lg max-w-xl mx-auto">
                Create your account now and get 25 free credits to test our APIs. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  to="/register" 
                  className="group bg-white hover:bg-zinc-100 text-black font-semibold px-8 py-4 rounded-xl transition-all duration-200 inline-flex items-center gap-2"
                >
                  Create Free Account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/docs" 
                  className="text-zinc-400 hover:text-white font-medium transition-colors inline-flex items-center gap-2"
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
