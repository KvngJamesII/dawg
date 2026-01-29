import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
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
  const { theme } = useTheme()
  const isDark = theme === 'dark'
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
      <div className="mb-6 sm:mb-8">
        <h1 className={`text-lg sm:text-xl font-semibold mb-1 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          Welcome back, {user?.name?.split(' ')[0] || 'Developer'}
        </h1>
        <p className={`text-sm ${isDark ? 'text-zinc-500' : 'text-zinc-600'}`}>
          Here's an overview of your API usage.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className={`rounded-xl p-3 sm:p-4 ${
                isDark 
                  ? 'bg-zinc-900/50 border border-zinc-800/50' 
                  : 'bg-white border border-zinc-200 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <Icon className={`w-4 h-4 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
                <span className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>{stat.label}</span>
              </div>
              <p className={`text-xl sm:text-2xl font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                {stat.value.toLocaleString()}
              </p>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* API Keys */}
        <div className={`rounded-xl p-4 sm:p-5 ${
          isDark 
            ? 'bg-zinc-900/50 border border-zinc-800/50' 
            : 'bg-white border border-zinc-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-zinc-900'}`}>API Keys</h2>
            <Link
              to="/dashboard/api-keys"
              className={`text-xs flex items-center gap-1 transition ${
                isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Manage
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="space-y-3">
            {apiKeys.map((item, index) => (
              <div
                key={index}
                className={`flex items-center justify-between rounded-lg p-3 ${
                  isDark ? 'bg-black/30' : 'bg-zinc-50'
                }`}
              >
                <div>
                  <div className={`text-xs mb-0.5 ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>{item.service}</div>
                  <div className={`text-sm font-mono ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                    {item.key ? `${item.key.substring(0, 16)}...` : 'Not generated'}
                  </div>
                </div>
                {item.key && (
                  <button
                    onClick={() => copyToClipboard(item.key, item.service)}
                    className={`p-1 transition ${isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-700'}`}
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
        <div className={`rounded-xl p-4 sm:p-5 ${
          isDark 
            ? 'bg-zinc-900/50 border border-zinc-800/50' 
            : 'bg-white border border-zinc-200 shadow-sm'
        }`}>
          <h2 className={`text-sm font-medium mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`}>Quick Start</h2>
          
          <div className={`rounded-lg p-3 mb-4 ${isDark ? 'bg-black' : 'bg-zinc-900'}`}>
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
            className={`text-xs flex items-center gap-1 transition ${
              isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            View full documentation
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Low Credits Warning */}
      {user?.credits < 10 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <p className={`text-sm ${isDark ? 'text-white' : 'text-zinc-900'}`}>Running low on credits</p>
              <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-600'}`}>You have {user?.credits} credits remaining</p>
            </div>
          </div>
          <Link to="/dashboard/purchase" className="btn-primary px-4 py-1.5 text-sm w-full sm:w-auto text-center">
            Buy Credits
          </Link>
        </div>
      )}
    </div>
  )
}
