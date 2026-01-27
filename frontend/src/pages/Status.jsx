import { CheckCircle2, Clock, AlertTriangle, XCircle } from 'lucide-react'

export default function Status() {
  const services = [
    { name: 'API Gateway', status: 'operational', uptime: '99.99%' },
    { name: 'TikTok API', status: 'operational', uptime: '99.95%' },
    { name: 'YouTube API', status: 'operational', uptime: '99.98%' },
    { name: 'Authentication', status: 'operational', uptime: '99.99%' },
    { name: 'Dashboard', status: 'operational', uptime: '99.99%' },
    { name: 'Payment Processing', status: 'operational', uptime: '99.99%' },
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      case 'degraded':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />
      case 'outage':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-zinc-500" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'operational':
        return 'Operational'
      case 'degraded':
        return 'Degraded Performance'
      case 'outage':
        return 'Major Outage'
      default:
        return 'Unknown'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational':
        return 'text-emerald-400'
      case 'degraded':
        return 'text-amber-400'
      case 'outage':
        return 'text-red-400'
      default:
        return 'text-zinc-400'
    }
  }

  const allOperational = services.every(s => s.status === 'operational')

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-semibold text-white mb-6">
            System Status
          </h1>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
            allOperational 
              ? 'bg-emerald-500/10 border border-emerald-500/20' 
              : 'bg-amber-500/10 border border-amber-500/20'
          }`}>
            {allOperational ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-emerald-400 font-medium">All Systems Operational</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span className="text-amber-400 font-medium">Some Systems Affected</span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-8 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl overflow-hidden">
            {services.map((service, i) => (
              <div 
                key={i} 
                className={`flex items-center justify-between p-4 ${
                  i !== services.length - 1 ? 'border-b border-zinc-800/50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(service.status)}
                  <span className="text-white font-medium">{service.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-zinc-500">{service.uptime} uptime</span>
                  <span className={`text-sm ${getStatusColor(service.status)}`}>
                    {getStatusText(service.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Uptime History */}
      <section className="py-12 px-6 border-t border-zinc-900">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold text-white mb-6">90-Day Uptime</h2>
          <div className="flex gap-0.5">
            {[...Array(90)].map((_, i) => (
              <div 
                key={i} 
                className="flex-1 h-8 bg-emerald-500 rounded-sm opacity-90 hover:opacity-100 transition-opacity"
                title={`Day ${90 - i}: 100% uptime`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-zinc-500">
            <span>90 days ago</span>
            <span>Today</span>
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section className="py-12 px-6 border-t border-zinc-900">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-xl font-semibold text-white mb-4">Get Status Updates</h2>
          <p className="text-zinc-400 mb-6 text-sm">
            Subscribe to receive notifications about incidents and maintenance.
          </p>
          <div className="flex gap-3">
            <input 
              type="email" 
              placeholder="you@example.com" 
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
            />
            <button className="bg-white text-black font-medium px-5 py-2.5 rounded-lg hover:bg-zinc-200 transition text-sm">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
