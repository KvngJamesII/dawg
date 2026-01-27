import { Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Careers() {
  const openings = [
    {
      title: 'Senior Backend Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Help us build scalable APIs that serve millions of requests daily.'
    },
    {
      title: 'Frontend Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Create beautiful, responsive user interfaces for our developer platform.'
    },
    {
      title: 'Developer Advocate',
      department: 'Developer Relations',
      location: 'Remote',
      type: 'Full-time',
      description: 'Help developers succeed with our APIs through content, tutorials, and community engagement.'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-semibold text-white mb-6">
            Join Our Team
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            We're building tools that developers love. Come help us shape the future of API infrastructure.
          </p>
        </div>
      </section>

      {/* Why Join */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Remote First', desc: 'Work from anywhere in the world. We believe great talent is everywhere.' },
              { title: 'Competitive Pay', desc: 'Top-tier compensation with equity. We invest in our team.' },
              { title: 'Growth', desc: 'Learn and grow with challenging projects and mentorship opportunities.' }
            ].map((perk, i) => (
              <div key={i} className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6 text-center">
                <h3 className="text-lg font-semibold text-white mb-2">{perk.title}</h3>
                <p className="text-sm text-zinc-500">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-12 px-6 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-white mb-8">Open Positions</h2>
          
          {openings.length > 0 ? (
            <div className="space-y-4">
              {openings.map((job, i) => (
                <div 
                  key={i} 
                  className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6 hover:border-zinc-700 transition-all group cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-sm text-zinc-400 mb-3">{job.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {job.type}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-12 text-center">
              <p className="text-zinc-400 mb-4">No open positions right now.</p>
              <p className="text-sm text-zinc-500">
                Check back soon or send us your resume at{' '}
                <a href="mailto:careers@idledeveloper.tech" className="text-emerald-400 hover:underline">
                  careers@idledeveloper.tech
                </a>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 border-t border-zinc-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">Don't see your role?</h2>
          <p className="text-zinc-400 mb-6">
            We're always looking for talented people. Send us your resume and tell us how you can contribute.
          </p>
          <a 
            href="https://t.me/theidledeveloper" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-black font-medium px-6 py-3 rounded-lg hover:bg-zinc-200 transition"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  )
}
