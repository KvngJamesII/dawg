import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import api from '../utils/api'
import { 
  BarChart3, 
  Calendar, 
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  Activity
} from 'lucide-react'

export default function Usage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [period, setPeriod] = useState('7d')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalRequests: 0,
    successRate: 0,
    creditsUsed: 0,
    byService: {}
  })
  const [history, setHistory] = useState([])

  useEffect(() => {
    fetchUsageData()
  }, [period])

  const fetchUsageData = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/user/usage?period=${period}`)
      if (response.data.success) {
        setStats(response.data.stats)
        setHistory(response.data.history || [])
      }
    } catch (error) {
      console.error('Failed to fetch usage data:', error)
    } finally {
      setLoading(false)
    }
  }

  const periods = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: 'all', label: 'All Time' }
  ]

  const serviceStats = [
    {
      name: 'TikTok',
      requests: stats.byService?.tiktok?.requests || 0,
      credits: stats.byService?.tiktok?.credits || 0,
      color: 'bg-gradient-to-r from-pink-500 to-red-500'
    },
    {
      name: 'YouTube',
      requests: stats.byService?.youtube?.requests || 0,
      credits: stats.byService?.youtube?.credits || 0,
      color: 'bg-gradient-to-r from-red-500 to-orange-500'
    }
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className={`text-xl sm:text-2xl font-bold mb-1 sm:mb-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>Usage Analytics</h1>
          <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Track your API usage and credit consumption
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className={`border rounded-xl px-3 sm:px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 ${
              isDark 
                ? 'bg-zinc-900 border-zinc-800 text-white' 
                : 'bg-white border-zinc-200 text-zinc-900'
            }`}
          >
            {periods.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className={`rounded-2xl p-5 sm:p-6 ${
          isDark 
            ? 'bg-zinc-900/50 border border-zinc-800/50' 
            : 'bg-white border border-zinc-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Activity className="w-5 sm:w-6 h-5 sm:h-6 text-emerald-500" />
            </div>
            <span className="flex items-center text-green-500 text-sm">
              <ArrowUpRight className="w-4 h-4" />
              Active
            </span>
          </div>
          <p className={`text-sm mb-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Total Requests</p>
          <p className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{stats.totalRequests.toLocaleString()}</p>
        </div>

        <div className={`rounded-2xl p-5 sm:p-6 ${
          isDark 
            ? 'bg-zinc-900/50 border border-zinc-800/50' 
            : 'bg-white border border-zinc-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <BarChart3 className="w-5 sm:w-6 h-5 sm:h-6 text-green-500" />
            </div>
            <span className={`flex items-center text-sm ${stats.successRate >= 95 ? 'text-green-500' : 'text-yellow-500'}`}>
              {stats.successRate}%
            </span>
          </div>
          <p className={`text-sm mb-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Success Rate</p>
          <div className={`w-full rounded-full h-2 mt-2 ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${stats.successRate}%` }}
            />
          </div>
        </div>

        <div className={`rounded-2xl p-5 sm:p-6 ${
          isDark 
            ? 'bg-zinc-900/50 border border-zinc-800/50' 
            : 'bg-white border border-zinc-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Calendar className="w-5 sm:w-6 h-5 sm:h-6 text-purple-500" />
            </div>
          </div>
          <p className={`text-sm mb-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Credits Used</p>
          <p className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{stats.creditsUsed.toLocaleString()}</p>
        </div>
      </div>

      {/* Service Breakdown */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className={`rounded-2xl p-5 sm:p-6 ${
          isDark 
            ? 'bg-zinc-900/50 border border-zinc-800/50' 
            : 'bg-white border border-zinc-200 shadow-sm'
        }`}>
          <h2 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-zinc-900'}`}>Usage by Service</h2>
          <div className="space-y-6">
            {serviceStats.map((service, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${service.color}`} />
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-zinc-900'}`}>{service.name}</span>
                  </div>
                  <span className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>{service.requests} requests</span>
                </div>
                <div className={`w-full rounded-full h-2 ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
                  <div 
                    className={`${service.color} h-2 rounded-full transition-all duration-500`}
                    style={{ 
                      width: `${stats.totalRequests > 0 ? (service.requests / stats.totalRequests) * 100 : 0}%` 
                    }}
                  />
                </div>
                <p className={`text-sm mt-1 ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>{service.credits} credits used</p>
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-2xl p-5 sm:p-6 ${
          isDark 
            ? 'bg-zinc-900/50 border border-zinc-800/50' 
            : 'bg-white border border-zinc-200 shadow-sm'
        }`}>
          <h2 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-zinc-900'}`}>Quick Stats</h2>
          <div className="space-y-4">
            <div className={`flex items-center justify-between p-4 rounded-xl ${isDark ? 'bg-black/30' : 'bg-zinc-50'}`}>
              <span className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>Average Daily Requests</span>
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                {period === '7d' ? Math.round(stats.totalRequests / 7) : 
                 period === '30d' ? Math.round(stats.totalRequests / 30) :
                 period === '24h' ? stats.totalRequests : '-'}
              </span>
            </div>
            <div className={`flex items-center justify-between p-4 rounded-xl ${isDark ? 'bg-black/30' : 'bg-zinc-50'}`}>
              <span className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>Cost per Request</span>
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`}>1 credit</span>
            </div>
            <div className={`flex items-center justify-between p-4 rounded-xl ${isDark ? 'bg-black/30' : 'bg-zinc-50'}`}>
              <span className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>Failed Requests</span>
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                {Math.round(stats.totalRequests * (1 - stats.successRate / 100))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Request History */}
      <div className={`rounded-2xl p-5 sm:p-6 ${
        isDark 
          ? 'bg-zinc-900/50 border border-zinc-800/50' 
          : 'bg-white border border-zinc-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`}>Request History</h2>
          <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
            isDark ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-zinc-100 hover:bg-zinc-200'
          }`}>
            <Download className={`w-4 h-4 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`} />
            <span className={`text-sm ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>Export</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>Loading usage data...</p>
          </div>
        ) : history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`text-left text-sm border-b ${isDark ? 'text-zinc-400 border-zinc-800' : 'text-zinc-500 border-zinc-200'}`}>
                  <th className="pb-4 font-medium">Timestamp</th>
                  <th className="pb-4 font-medium">Service</th>
                  <th className="pb-4 font-medium">Endpoint</th>
                  <th className="pb-4 font-medium">Status</th>
                  <th className="pb-4 font-medium text-right">Credits</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => (
                  <tr key={index} className={`border-b last:border-0 ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`}>
                    <td className={`py-4 text-sm ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{item.timestamp}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        item.service === 'tiktok' ? 'bg-pink-500/20 text-pink-500' : 'bg-red-500/20 text-red-500'
                      }`}>
                        {item.service}
                      </span>
                    </td>
                    <td className={`py-4 text-sm font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{item.endpoint}</td>
                    <td className="py-4">
                      <span className={`flex items-center space-x-1 text-sm ${
                        item.success ? 'text-green-500' : 'text-red-500'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${item.success ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span>{item.success ? 'Success' : 'Failed'}</span>
                      </span>
                    </td>
                    <td className={`py-4 text-right text-sm ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      {item.success ? '-1' : '0'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Activity className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`} />
            <p className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>No requests in this period</p>
            <p className={`text-sm ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>Start making API requests to see your usage history</p>
          </div>
        )}
      </div>
    </div>
  )
}
