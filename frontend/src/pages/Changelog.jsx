import { Zap, Sparkles, Bug, Wrench } from 'lucide-react'

export default function Changelog() {
  const releases = [
    {
      version: '1.2.0',
      date: 'Jan 27, 2026',
      type: 'feature',
      changes: [
        { type: 'feature', text: 'Added light/dark theme toggle' },
        { type: 'feature', text: 'New About, Blog, Careers, and Status pages' },
        { type: 'improvement', text: 'Updated footer with social links' },
        { type: 'fix', text: 'Fixed API key generation error message' },
      ]
    },
    {
      version: '1.1.0',
      date: 'Jan 26, 2026',
      type: 'feature',
      changes: [
        { type: 'feature', text: 'Added Paystack payment integration' },
        { type: 'feature', text: 'Google OAuth sign-in support' },
        { type: 'improvement', text: 'Improved admin dashboard UI' },
        { type: 'improvement', text: 'Better error handling for API requests' },
      ]
    },
    {
      version: '1.0.0',
      date: 'Jan 25, 2026',
      type: 'release',
      changes: [
        { type: 'feature', text: 'Initial release of IdleDeveloper API Platform' },
        { type: 'feature', text: 'TikTok video download API' },
        { type: 'feature', text: 'YouTube audio extraction API' },
        { type: 'feature', text: 'User authentication and dashboard' },
        { type: 'feature', text: 'Credit-based billing system' },
        { type: 'feature', text: 'Admin panel for user management' },
      ]
    },
  ]

  const getChangeIcon = (type) => {
    switch (type) {
      case 'feature':
        return <Sparkles className="w-4 h-4 text-emerald-400" />
      case 'improvement':
        return <Zap className="w-4 h-4 text-blue-400" />
      case 'fix':
        return <Bug className="w-4 h-4 text-amber-400" />
      default:
        return <Wrench className="w-4 h-4 text-zinc-400" />
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-semibold text-white mb-6">Changelog</h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            All the latest updates, improvements, and fixes to IdleDeveloper API.
          </p>
        </div>
      </section>

      {/* Releases */}
      <section className="py-8 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            {releases.map((release, i) => (
              <div key={i} className="relative pl-8 border-l border-zinc-800">
                <div className="absolute left-0 top-0 w-3 h-3 -translate-x-1/2 rounded-full bg-emerald-500" />
                
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xl font-semibold text-white">v{release.version}</span>
                    <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">
                      {release.date}
                    </span>
                  </div>
                </div>

                <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-5">
                  <ul className="space-y-3">
                    {release.changes.map((change, j) => (
                      <li key={j} className="flex items-start gap-3">
                        {getChangeIcon(change.type)}
                        <span className="text-sm text-zinc-300">{change.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
