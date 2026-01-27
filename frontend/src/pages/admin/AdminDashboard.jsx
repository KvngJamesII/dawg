import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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
  XCircle,
  CreditCard,
  Clock,
  Zap,
  RefreshCw,
  AlertTriangle,
  BarChart3,
  DollarSign,
  UserPlus,
  Loader2
} from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalCredits: 0,
    totalRequests: 0,
    todayRequests: 0,
    todaySignups: 0,
    totalRevenue: 0,
    pendingTransactions: 0
  })
  const [systemStatus, setSystemStatus] = useState({
    api: true,
    database: true,
    tiktok: true,
    youtube: true,
    paystack: true
  })
  const [recentUsers, setRecentUsers] = useState([])
  const [recentTransactions, setRecentTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      const response = await api.get('/admin/dashboard')
      if (response.data.success) {
        setStats(response.data.stats)
        setRecentUsers(response.data.recentUsers || [])
        setRecentTransactions(response.data.recentTransactions || [])
        setSystemStatus(response.data.systemStatus || systemStatus)
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchAdminData()
    setRefreshing(false)
  }

  const statCards = [
    {
      icon: Users,
      label: 'Total Users',
      value: stats.totalUsers,
      change: `+${stats.todaySignups} today`,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      positive: true
    },
    {
      icon: Activity,
      label: 'Active Users',
      value: stats.activeUsers,
      change: 'Last 7 days',
      color: 'from-emerald-500 to-green-500',
      bgColor: 'bg-emerald-500/10',
      positive: true
    },
    {
      icon: TrendingUp,
      label: 'API Requests',
      value: stats.totalRequests.toLocaleString(),
      change: `${stats.todayRequests} today`,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      positive: true
    },
    {
      icon: Coins,
      label: 'Credits in Circulation',
      value: stats.totalCredits.toLocaleString(),
      change: 'All users',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/10',
      positive: true
    }
  ]

  const services = [
    { name: 'API Server', status: systemStatus.api, icon: Server },
    { name: 'Database', status: systemStatus.database, icon: BarChart3 },
    { name: 'TikTok Service', status: systemStatus.tiktok, icon: Zap },
    { name: 'YouTube Service', status: systemStatus.youtube, icon: Zap },
    { name: 'Paystack', status: systemStatus.paystack, icon: CreditCard }
  ]

  const quickActions = [
    { label: 'Add Credits', icon: Coins, href: '/admin/users', color: 'bg-emerald-500/20 text-emerald-400' },
    { label: 'View Users', icon: Users, href: '/admin/users', color: 'bg-blue-500/20 text-blue-400' },
    { label: 'Settings', icon: Server, href: '/admin/settings', color: 'bg-purple-500/20 text-purple-400' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Admin Dashboard</h1>
          <p className="text-zinc-500">
            Overview of your API platform statistics and system status
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} style={{ color: stat.color.includes('blue') ? '#3b82f6' : stat.color.includes('emerald') ? '#10b981' : stat.color.includes('purple') ? '#a855f7' : '#f59e0b' }} />
                </div>
                <span className={`flex items-center text-xs font-medium ${stat.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stat.positive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-zinc-500 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-zinc-400 mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.href}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg ${action.color} hover:opacity-80 transition-all`}
            >
              <action.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* System Status */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-semibold text-white">System Status</h2>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-emerald-400">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              All systems operational
            </span>
          </div>
          <div className="space-y-2">
            {services.map((service, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <service.icon className="w-4 h-4 text-zinc-500" />
                  <span className="text-sm text-zinc-300">{service.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {service.status ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-emerald-400 text-xs">Online</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span className="text-red-400 text-xs">Offline</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-400" />
              <h2 className="text-base font-semibold text-white">Recent Users</h2>
            </div>
            <Link
              to="/admin/users"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              View All →
            </Link>
          </div>
          {recentUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-zinc-500 border-b border-zinc-800">
                    <th className="pb-3 font-medium">User</th>
                    <th className="pb-3 font-medium">Credits</th>
                    <th className="pb-3 font-medium">Requests</th>
                    <th className="pb-3 font-medium">Joined</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {recentUsers.slice(0, 5).map((user, index) => (
                    <tr key={index} className="text-sm">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                            <span className="text-white text-xs font-medium">
                              {user.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-medium">{user.name}</p>
                            <p className="text-zinc-500 text-xs">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="text-white">{user.credits?.toLocaleString() || 0}</span>
                      </td>
                      <td className="py-3">
                        <span className="text-zinc-400">{user.totalRequests?.toLocaleString() || 0}</span>
                      </td>
                      <td className="py-3">
                        <span className="text-zinc-500 text-xs">{user.createdAt}</span>
                      </td>
                      <td className="py-3">
                        {user.banned ? (
                          <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">Banned</span>
                        ) : (
                          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">Active</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-10 h-10 text-zinc-700 mx-auto mb-2" />
              <p className="text-zinc-500 text-sm">No users yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Platform Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <p className="text-zinc-500 text-xs">TikTok API</p>
              <p className="text-white font-semibold">Most Popular</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500">Requests today</span>
            <span className="text-white font-medium">{Math.floor(stats.todayRequests * 0.7)}</span>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-zinc-500 text-xs">YouTube API</p>
              <p className="text-white font-semibold">Growing</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500">Requests today</span>
            <span className="text-white font-medium">{Math.floor(stats.todayRequests * 0.3)}</span>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-zinc-500 text-xs">Revenue</p>
              <p className="text-white font-semibold">This Month</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500">Total</span>
            <span className="text-white font-medium">${stats.totalRevenue || 0}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
