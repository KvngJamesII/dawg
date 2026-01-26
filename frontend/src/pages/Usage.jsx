import { useState, useEffect } from 'react'
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Usage Analytics</h1>
          <p className="text-gray-400">
            Track your API usage and credit consumption
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-dark-800 border border-dark-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary-500"
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
              <Activity className="w-6 h-6 text-primary-400" />
            </div>
            <span className="flex items-center text-green-500 text-sm">
              <ArrowUpRight className="w-4 h-4" />
              Active
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-1">Total Requests</p>
          <p className="text-3xl font-bold text-white">{stats.totalRequests.toLocaleString()}</p>
        </div>

        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-green-400" />
            </div>
            <span className={`flex items-center text-sm ${stats.successRate >= 95 ? 'text-green-500' : 'text-yellow-500'}`}>
              {stats.successRate}%
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-1">Success Rate</p>
          <div className="w-full bg-dark-600 rounded-full h-2 mt-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${stats.successRate}%` }}
            />
          </div>
        </div>

        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Credits Used</p>
          <p className="text-3xl font-bold text-white">{stats.creditsUsed.toLocaleString()}</p>
        </div>
      </div>

      {/* Service Breakdown */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Usage by Service</h2>
          <div className="space-y-6">
            {serviceStats.map((service, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${service.color}`} />
                    <span className="text-white font-medium">{service.name}</span>
                  </div>
                  <span className="text-gray-400">{service.requests} requests</span>
                </div>
                <div className="w-full bg-dark-600 rounded-full h-2">
                  <div 
                    className={`${service.color} h-2 rounded-full transition-all duration-500`}
                    style={{ 
                      width: `${stats.totalRequests > 0 ? (service.requests / stats.totalRequests) * 100 : 0}%` 
                    }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">{service.credits} credits used</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-dark-900 rounded-xl">
              <span className="text-gray-400">Average Daily Requests</span>
              <span className="text-white font-semibold">
                {period === '7d' ? Math.round(stats.totalRequests / 7) : 
                 period === '30d' ? Math.round(stats.totalRequests / 30) :
                 period === '24h' ? stats.totalRequests : '-'}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-dark-900 rounded-xl">
              <span className="text-gray-400">Cost per Request</span>
              <span className="text-white font-semibold">1 credit</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-dark-900 rounded-xl">
              <span className="text-gray-400">Failed Requests</span>
              <span className="text-white font-semibold">
                {Math.round(stats.totalRequests * (1 - stats.successRate / 100))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Request History */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Request History</h2>
          <button className="flex items-center space-x-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition">
            <Download className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">Export</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading usage data...</p>
          </div>
        ) : history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-dark-600">
                  <th className="pb-4 font-medium">Timestamp</th>
                  <th className="pb-4 font-medium">Service</th>
                  <th className="pb-4 font-medium">Endpoint</th>
                  <th className="pb-4 font-medium">Status</th>
                  <th className="pb-4 font-medium text-right">Credits</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => (
                  <tr key={index} className="border-b border-dark-700 last:border-0">
                    <td className="py-4 text-gray-300 text-sm">{item.timestamp}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        item.service === 'tiktok' ? 'bg-pink-500/20 text-pink-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {item.service}
                      </span>
                    </td>
                    <td className="py-4 text-gray-400 text-sm font-mono">{item.endpoint}</td>
                    <td className="py-4">
                      <span className={`flex items-center space-x-1 text-sm ${
                        item.success ? 'text-green-400' : 'text-red-400'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${item.success ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span>{item.success ? 'Success' : 'Failed'}</span>
                      </span>
                    </td>
                    <td className="py-4 text-right text-gray-300 text-sm">
                      {item.success ? '-1' : '0'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No requests in this period</p>
            <p className="text-gray-500 text-sm">Start making API requests to see your usage history</p>
          </div>
        )}
      </div>
    </div>
  )
}
