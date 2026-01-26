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
  Terminal
} from 'lucide-react'
import { useState } from 'react'

export default function Home() {
  const [copiedCode, setCopiedCode] = useState(false)

  const copyCode = () => {
    navigator.clipboard.writeText(`curl -X GET "https://api.idledeveloper.tech/api/tiktok?url=VIDEO_URL" \\
  -H "X-API-Key: YOUR_API_KEY"`)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        
        <div className="relative max-w-6xl mx-auto px-6">
          {/* Status badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5">
              <span className="status-dot status-online" />
              <span className="text-xs text-zinc-400">All systems operational</span>
            </div>
          </div>

          {/* Main headline */}
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-[1.1] mb-6">
              Video Download API
              <br />
              <span className="text-zinc-500">for Developers</span>
            </h1>
            
            <p className="text-lg text-zinc-400 mb-10 max-w-xl mx-auto leading-relaxed">
              Fast, reliable API for downloading TikTok videos and extracting YouTube audio. 
              Simple integration, transparent pricing.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="btn-primary px-8 py-3 text-base">
                Start Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/docs" className="btn-secondary px-8 py-3 text-base">
                <Code2 className="w-4 h-4" />
                Documentation
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-zinc-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>25 Free Credits</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>No Credit Card</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Instant Access</span>
              </div>
            </div>
          </div>

          {/* Code preview */}
          <div className="mt-20 max-w-2xl mx-auto">
            <div className="bg-black border border-zinc-800 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-zinc-500" />
                  <span className="text-xs text-zinc-500 font-mono">Quick Start</span>
                </div>
                <button 
                  onClick={copyCode}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  {copiedCode ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <pre className="p-4 text-sm overflow-x-auto">
                <code className="text-zinc-300">
                  <span className="text-emerald-400">curl</span> -X GET <span className="text-amber-300">"https://api.idledeveloper.tech/api/tiktok?url=VIDEO_URL"</span> \{'\n'}
                  {'  '}-H <span className="text-amber-300">"X-API-Key: YOUR_API_KEY"</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-white mb-4">
              Built for developers
            </h2>
            <p className="text-zinc-400 max-w-lg mx-auto">
              Everything you need to integrate video downloads into your application.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Download,
                title: 'TikTok Downloads',
                description: 'Download videos without watermark in HD quality. Get video metadata, thumbnails, and author info.'
              },
              {
                icon: Youtube,
                title: 'YouTube Audio',
                description: 'Extract high-quality audio from any YouTube video. Perfect for music apps and audio processing.'
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Average response time under 500ms. Our infrastructure is optimized for speed and reliability.'
              },
              {
                icon: Shield,
                title: 'Secure & Reliable',
                description: '99.9% uptime with HTTPS encryption. Your API keys are securely stored and never exposed.'
              },
              {
                icon: Code2,
                title: 'Simple Integration',
                description: 'RESTful JSON API that works with any language. Comprehensive docs with code examples.'
              },
              {
                icon: Clock,
                title: '24/7 Support',
                description: 'Get help when you need it via Telegram. We typically respond within minutes.'
              }
            ].map((feature, index) => (
              <div key={index} className="p-6 rounded-xl border border-zinc-800/50 hover:border-zinc-700 bg-zinc-900/20 hover:bg-zinc-900/40 transition-all duration-300">
                <feature.icon className="w-5 h-5 text-zinc-400 mb-4" />
                <h3 className="text-white font-medium mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-white mb-4">
              Simple pricing
            </h2>
            <p className="text-zinc-400">
              Pay only for what you use. No subscriptions, no hidden fees.
            </p>
          </div>

          <div className="max-w-sm mx-auto">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-medium px-2.5 py-1 rounded-full mb-6">
                  <Zap className="w-3 h-3" />
                  Most Popular
                </div>
                
                <div className="mb-6">
                  <span className="text-5xl font-semibold text-white">$2</span>
                  <span className="text-zinc-500 ml-2">/ 5,000 credits</span>
                </div>
                
                <p className="text-sm text-zinc-500 mb-8">
                  1 credit = 1 API request
                </p>

                <ul className="space-y-3 text-left mb-8">
                  {[
                    '25 free credits to start',
                    'TikTok & YouTube access',
                    'Credits never expire',
                    'Priority support'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Link to="/register" className="btn-primary w-full py-3">
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-zinc-900">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-white mb-4">
            Ready to start building?
          </h2>
          <p className="text-zinc-400 mb-8">
            Create your account now and get 25 free credits to test the API.
          </p>
          <Link to="/register" className="btn-primary px-8 py-3 text-base">
            Create Free Account
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
