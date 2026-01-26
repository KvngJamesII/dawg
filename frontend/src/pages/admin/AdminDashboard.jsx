import { useState, useEffect } from 'react'
import api from '../../utils/api'
import { 
  Users, 
  Coins, 
  Activity, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Server,
  CheckCircle,
  XCircle
} from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalCredits: 0,
    totalRequests: 0,
    todayRequests: 0,
    todaySignups: 0
  })
  const [systemStatus, setSystemStatus] = useState({
    api: true,
    database: true,
    tiktok: true,
    youtube: true
  })
  const [recentUsers, setRecentUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      const response = await api.get('/admin/dashboard')
      if (response.data.success) {
        setStats(response.data.stats)
        setRecentUsers(response.data.recentUsers || [])
        setSystemStatus(response.data.systemStatus || systemStatus)
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      icon: Users,
      label: 'Total Users',
      value: stats.totalUsers,
      change: `+${stats.todaySignups} today`,
      color: 'from-blue-500 to-cyan-500',
      positive: true
    },
    {
      icon: Activity,
      label: 'Active Users',
      value: stats.activeUsers,
      change: 'Last 7 days',
      color: 'from-green-500 to-emerald-500',
      positive: true
    },
    {
      icon: Coins,
      label: 'Total Credits Sold',
      value: stats.totalCredits.toLocaleString(),
      change: 'All time',
      color: 'from-yellow-500 to-orange-500',
      positive: true
    },
    {
      icon: TrendingUp,
      label: 'API Requests',
      value: stats.totalRequests.toLocaleString(),
      change: `${stats.todayRequests} today`,
      color: 'from-purple-500 to-pink-500',
      positive: true
    }
  ]

  const services = [
    { name: 'API Server', status: systemStatus.api },
    { name: 'Database', status: systemStatus.database },
    { name: 'TikTok Service', status: systemStatus.tiktok },
    { name: 'YouTube Service', status: systemStatus.youtube }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">
          Overview of your API platform statistics and system status
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
                <span className={`flex items-center text-sm ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* System Status */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Server className="w-5 h-5 text-primary-400" />
            <h2 className="text-lg font-semibold text-white">System Status</h2>
          </div>
          <div className="space-y-4">
            {services.map((service, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-dark-900 rounded-xl"
              >
                <span className="text-gray-300">{service.name}</span>
                <div className="flex items-center space-x-2">
                  {service.status ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-green-400 text-sm">Operational</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-500" />
                      <span className="text-red-400 text-sm">Down</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-primary-400" />
              <h2 className="text-lg font-semibold text-white">Recent Users</h2>
            </div>
            <a
              href="/admin/users"
              className="text-sm text-primary-400 hover:text-primary-300"
            >
              View All
            </a>
          </div>
          {recentUsers.length > 0 ? (
            <div className="space-y-3">
              {recentUsers.slice(0, 5).map((user, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-dark-900 rounded-xl"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 flex items-center justify-center">
                      <span className="text-white font-medium">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{user.name}</p>
                      <p className="text-gray-500 text-xs">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm">{user.credits} credits</p>
                    <p className="text-gray-500 text-xs">{user.createdAt}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No users yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
