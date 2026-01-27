import { Zap, Users, Globe, Target, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-semibold text-white mb-6">
            About IdleDeveloper
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            We're building the infrastructure that powers the next generation of applications. 
            Simple, reliable, and developer-first APIs.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-semibold text-white mb-4">Our Mission</h2>
              <p className="text-zinc-400 mb-4">
                We believe developers should spend their time building amazing products, 
                not wrestling with complex integrations and unreliable services.
              </p>
              <p className="text-zinc-400">
                That's why we created IdleDeveloper - a suite of APIs that just work. 
                No complicated setup, no hidden fees, no surprises. Just powerful tools 
                that help you ship faster.
              </p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">99.9%</div>
                  <div className="text-sm text-zinc-500">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">&lt;500ms</div>
                  <div className="text-sm text-zinc-500">Avg Response</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">1M+</div>
                  <div className="text-sm text-zinc-500">API Calls/Month</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">24/7</div>
                  <div className="text-sm text-zinc-500">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-6 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-white text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: 'Developer First',
                description: 'Everything we build starts with the developer experience. Clean APIs, great docs, and tools you actually want to use.'
              },
              {
                icon: Globe,
                title: 'Reliability',
                description: 'We obsess over uptime and performance. Your users depend on your app, and your app depends on us.'
              },
              {
                icon: Heart,
                title: 'Transparency',
                description: 'Simple pricing, clear documentation, and honest communication. No surprises, ever.'
              }
            ].map((value, i) => (
              <div key={i} className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6">
                <value.icon className="w-8 h-8 text-emerald-500 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
                <p className="text-sm text-zinc-500">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 border-t border-zinc-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">Ready to get started?</h2>
          <p className="text-zinc-400 mb-8">
            Join thousands of developers building with IdleDeveloper APIs.
          </p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-black font-medium px-6 py-3 rounded-lg hover:bg-zinc-200 transition">
            <Zap className="w-4 h-4" />
            Start Building Free
          </Link>
        </div>
      </section>
    </div>
  )
}
