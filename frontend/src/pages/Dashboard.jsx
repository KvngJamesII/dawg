import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import { 
  Zap, 
  TrendingUp, 
  Clock, 
  Copy, 
  CheckCircle,
  ArrowUpRight,
  Activity,
  Coins
} from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalRequests: 0,
    todayRequests: 0,
    creditsUsed: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [copiedKey, setCopiedKey] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/user/stats')
      if (response.data.success) {
        setStats(response.data.stats)
        setRecentActivity(response.data.recentActivity || [])
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
      // Fallback
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopiedKey(keyType)
      setTimeout(() => setCopiedKey(null), 2000)
    }
  }

  const statCards = [
    {
      icon: Coins,
      label: 'Available Credits',
      value: user?.credits || 0,
      change: null,
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Activity,
      label: 'Total Requests',
      value: stats.totalRequests,
      change: '+12%',
      color: 'from-primary-500 to-blue-600'
    },
    {
      icon: Clock,
      label: 'Today\'s Requests',
      value: stats.todayRequests,
      change: null,
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: TrendingUp,
      label: 'Credits Used',
      value: stats.creditsUsed,
      change: null,
      color: 'from-orange-500 to-red-600'
    }
  ]

  const apiKeys = [
    {
      service: 'TikTok',
      key: user?.apiKeys?.tiktok || 'No key generated',
      color: 'bg-gradient-to-r from-pink-500 to-red-500'
    },
    {
      service: 'YouTube',
      key: user?.apiKeys?.youtube || 'No key generated',
      color: 'bg-gradient-to-r from-red-500 to-orange-500'
    }
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          Welcome back, {user?.name?.split(' ')[0] || 'Developer'}!
        </h1>
        <p className="text-gray-400">
          Here's an overview of your API usage and account status.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="bg-dark-800 border border-dark-700 rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                {stat.change && (
                  <span className="flex items-center text-green-500 text-sm">
                    <ArrowUpRight className="w-4 h-4" />
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-white">{stat.value.toLocaleString()}</p>
            </div>
          )
        })}
      </div>

      {/* API Keys Section */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Your API Keys</h2>
            <a
              href="/dashboard/api-keys"
              className="text-sm text-primary-400 hover:text-primary-300 flex items-center space-x-1"
            >
              <span>Manage Keys</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
          <div className="space-y-4">
            {apiKeys.map((api, index) => (
              <div
                key={index}
                className="bg-dark-900 border border-dark-600 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg ${api.color} flex items-center justify-center`}>
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-white">{api.service}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(api.key, api.service)}
                    className="p-2 hover:bg-dark-700 rounded-lg transition"
                  >
                    {copiedKey === api.service ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <code className="text-sm text-gray-400 break-all">
                  {api.key.length > 40 ? api.key.slice(0, 20) + '...' + api.key.slice(-10) : api.key}
                </code>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Start */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Quick Start</h2>
          <div className="space-y-4">
            <div className="bg-dark-900 rounded-xl p-4">
              <p className="text-sm text-gray-400 mb-2">TikTok Video Download</p>
              <code className="text-xs text-primary-400 break-all">
                GET /api/tiktok?url=VIDEO_URL&key=YOUR_API_KEY
              </code>
            </div>
            <div className="bg-dark-900 rounded-xl p-4">
              <p className="text-sm text-gray-400 mb-2">YouTube Audio Extraction</p>
              <code className="text-xs text-primary-400 break-all">
                GET /api/youtube?url=VIDEO_URL&key=YOUR_API_KEY
              </code>
            </div>
          </div>
          <a
            href="/docs"
            className="mt-6 w-full py-3 border border-primary-500 text-primary-400 rounded-xl font-medium hover:bg-primary-500/10 transition flex items-center justify-center space-x-2"
          >
            <span>View Full Documentation</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Credit Alert */}
      {user?.credits < 10 && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
              <Coins className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-yellow-500 font-semibold mb-1">Low Credit Balance</h3>
              <p className="text-gray-400 text-sm mb-4">
                You have only {user?.credits} credits remaining. Purchase more credits to continue using the API.
              </p>
              <a
                href="/dashboard/purchase"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-black rounded-lg font-medium hover:bg-yellow-400 transition"
              >
                <span>Buy Credits</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Recent Activity</h2>
        {recentActivity.length > 0 ? (
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-dark-700 last:border-0"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${activity.success ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div>
                    <p className="text-white text-sm">{activity.endpoint}</p>
                    <p className="text-gray-500 text-xs">{activity.timestamp}</p>
                  </div>
                </div>
                <span className="text-gray-400 text-sm">-1 credit</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No recent activity</p>
            <p className="text-gray-500 text-sm">Start making API requests to see your activity here</p>
          </div>
        )}
      </div>
    </div>
  )
}
