import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import { 
  Zap, 
  Copy, 
  CheckCircle2,
  ArrowRight,
  Activity,
  Coins,
  Clock,
  TrendingUp
} from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalRequests: 0,
    todayRequests: 0,
    creditsUsed: 0
  })
  const [copiedKey, setCopiedKey] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/user/stats')
      if (response.data.success) {
        setStats(response.data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    }
  }

  const copyToClipboard = async (text, keyType) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(keyType)
      setTimeout(() => setCopiedKey(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const statCards = [
    {
      icon: Coins,
      label: 'Available Credits',
      value: user?.credits || 0,
    },
    {
      icon: Activity,
      label: 'Total Requests',
      value: stats.totalRequests,
    },
    {
      icon: Clock,
      label: 'Today\'s Requests',
      value: stats.todayRequests,
    },
    {
      icon: TrendingUp,
      label: 'Credits Used',
      value: stats.creditsUsed,
    }
  ]

  const apiKeys = [
    {
      service: 'TikTok',
      key: user?.apiKeys?.tiktok || null,
    },
    {
      service: 'YouTube',
      key: user?.apiKeys?.youtube || null,
    }
  ]

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-white mb-1">
          Welcome back, {user?.name?.split(' ')[0] || 'Developer'}
        </h1>
        <p className="text-sm text-zinc-500">
          Here's an overview of your API usage.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-4 h-4 text-zinc-500" />
                <span className="text-xs text-zinc-500">{stat.label}</span>
              </div>
              <p className="text-2xl font-semibold text-white">{stat.value.toLocaleString()}</p>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* API Keys */}
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-white">API Keys</h2>
            <Link
              to="/dashboard/api-keys"
              className="text-xs text-zinc-500 hover:text-white flex items-center gap-1 transition"
            >
              Manage
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="space-y-3">
            {apiKeys.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-black/30 rounded-lg p-3"
              >
                <div>
                  <div className="text-xs text-zinc-500 mb-0.5">{item.service}</div>
                  <div className="text-sm text-zinc-300 font-mono">
                    {item.key ? `${item.key.substring(0, 16)}...` : 'Not generated'}
                  </div>
                </div>
                {item.key && (
                  <button
                    onClick={() => copyToClipboard(item.key, item.service)}
                    className="text-zinc-500 hover:text-white transition p-1"
                  >
                    {copiedKey === item.service ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Start */}
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-5">
          <h2 className="text-sm font-medium text-white mb-4">Quick Start</h2>
          
          <div className="bg-black rounded-lg p-3 mb-4">
            <pre className="text-xs text-zinc-400 overflow-x-auto">
              <code>
                curl -X GET \{'\n'}
                {'  '}"https://api.idledeveloper.tech/api/tiktok?url=VIDEO_URL" \{'\n'}
                {'  '}-H "X-API-Key: YOUR_KEY"
              </code>
            </pre>
          </div>

          <Link
            to="/docs"
            className="text-xs text-zinc-500 hover:text-white flex items-center gap-1 transition"
          >
            View full documentation
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Low Credits Warning */}
      {user?.credits < 10 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-white">Running low on credits</p>
              <p className="text-xs text-zinc-500">You have {user?.credits} credits remaining</p>
            </div>
          </div>
          <Link to="/dashboard/purchase" className="btn-primary px-4 py-1.5 text-sm">
            Buy Credits
          </Link>
        </div>
      )}
    </div>
  )
}
