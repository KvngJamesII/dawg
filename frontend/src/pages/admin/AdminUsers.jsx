import { useState, useEffect } from 'react'
import api from '../../utils/api'
import { 
  Users, 
  Search, 
  Filter,
  MoreVertical,
  Mail,
  Coins,
  Calendar,
  Trash2,
  Edit,
  Ban,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Download,
  UserPlus,
  Shield,
  Eye,
  Copy,
  Key
} from 'lucide-react'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showCreditModal, setShowCreditModal] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [creditAmount, setCreditAmount] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users')
      if (response.data.success) {
        setUsers(response.data.users)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users
    .filter(user => {
      const matchesSearch = 
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase())
      
      if (filter === 'all') return matchesSearch
      if (filter === 'active') return matchesSearch && user.credits > 0
      if (filter === 'inactive') return matchesSearch && user.credits === 0
      if (filter === 'banned') return matchesSearch && user.banned
      if (filter === 'admin') return matchesSearch && user.isAdmin
      return matchesSearch
    })
    .sort((a, b) => {
      let aVal = a[sortBy]
      let bVal = b[sortBy]
      
      if (sortBy === 'createdAt') {
        aVal = new Date(a.createdAt || 0)
        bVal = new Date(b.createdAt || 0)
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1
      }
      return aVal < bVal ? 1 : -1
    })

  const handleAddCredits = async () => {
    if (!selectedUser || !creditAmount) return
    
    setActionLoading(true)
    setError('')
    
    try {
      const response = await api.post(`/admin/users/${selectedUser.id}/credits`, {
        amount: parseInt(creditAmount)
      })
      if (response.data.success) {
        setSuccess(`Added ${creditAmount} credits to ${selectedUser.name}`)
        fetchUsers()
        setShowCreditModal(false)
        setCreditAmount('')
        setSelectedUser(null)
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add credits')
    } finally {
      setActionLoading(false)
    }
  }

  const handleToggleBan = async (user) => {
    if (!confirm(`Are you sure you want to ${user.banned ? 'unban' : 'ban'} ${user.name}?`)) {
      return
    }

    setActionLoading(true)
    try {
      const response = await api.post(`/admin/users/${user.id}/toggle-ban`)
      if (response.data.success) {
        setSuccess(`User ${user.banned ? 'unbanned' : 'banned'} successfully`)
        fetchUsers()
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update user')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteUser = async (user) => {
    if (!confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
      return
    }

    setActionLoading(true)
    try {
      const response = await api.delete(`/admin/users/${user.id}`)
      if (response.data.success) {
        setSuccess('User deleted successfully')
        fetchUsers()
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete user')
    } finally {
      setActionLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setSuccess('Copied to clipboard')
    setTimeout(() => setSuccess(''), 2000)
  }

  const exportUsers = () => {
    const csv = [
      ['Name', 'Email', 'Credits', 'Requests', 'Status', 'Joined'].join(','),
      ...filteredUsers.map(u => [
        u.name,
        u.email,
        u.credits || 0,
        u.totalRequests || 0,
        u.banned ? 'Banned' : 'Active',
        u.createdAt
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'users.csv'
    a.click()
  }

  const stats = {
    total: users.length,
    active: users.filter(u => u.credits > 0 && !u.banned).length,
    banned: users.filter(u => u.banned).length,
    totalCredits: users.reduce((sum, u) => sum + (u.credits || 0), 0)
  }

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">User Management</h1>
          <p className="text-zinc-500">
            Manage users, add credits, and moderate accounts
          </p>
        </div>
        <button
          onClick={exportUsers}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-all text-sm"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <p className="text-zinc-500 text-xs mb-1">Total Users</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <p className="text-zinc-500 text-xs mb-1">Active Users</p>
          <p className="text-2xl font-bold text-emerald-400">{stats.active}</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <p className="text-zinc-500 text-xs mb-1">Banned Users</p>
          <p className="text-2xl font-bold text-red-400">{stats.banned}</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <p className="text-zinc-500 text-xs mb-1">Total Credits</p>
          <p className="text-2xl font-bold text-yellow-400">{stats.totalCredits.toLocaleString()}</p>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm">{error}</p>
          <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-300">×</button>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <p className="text-emerald-400 text-sm">{success}</p>
          <button onClick={() => setSuccess('')} className="ml-auto text-emerald-400 hover:text-emerald-300">×</button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 text-sm"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 text-sm"
        >
          <option value="all">All Users</option>
          <option value="active">Active (Has Credits)</option>
          <option value="inactive">Inactive (No Credits)</option>
          <option value="banned">Banned</option>
          <option value="admin">Admins</option>
        </select>
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [by, order] = e.target.value.split('-')
            setSortBy(by)
            setSortOrder(order)
          }}
          className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 text-sm"
        >
          <option value="createdAt-desc">Newest First</option>
          <option value="createdAt-asc">Oldest First</option>
          <option value="credits-desc">Most Credits</option>
          <option value="credits-asc">Least Credits</option>
          <option value="totalRequests-desc">Most Requests</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-zinc-500 border-b border-zinc-800 bg-zinc-900/50">
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Credits</th>
                <th className="p-4 font-medium">Requests</th>
                <th className="p-4 font-medium">API Keys</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Joined</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm font-medium">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-white font-medium text-sm truncate">{user.name}</p>
                            {user.isAdmin && (
                              <Shield className="w-3.5 h-3.5 text-yellow-500" title="Admin" />
                            )}
                          </div>
                          <p className="text-zinc-500 text-xs truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <Coins className="w-4 h-4 text-yellow-500" />
                        <span className="text-white text-sm font-medium">{(user.credits || 0).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="p-4 text-zinc-400 text-sm">{(user.totalRequests || 0).toLocaleString()}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        {user.apiKeys?.tiktok && (
                          <span className="px-1.5 py-0.5 bg-pink-500/20 text-pink-400 rounded text-[10px]">TT</span>
                        )}
                        {user.apiKeys?.youtube && (
                          <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded text-[10px]">YT</span>
                        )}
                        {!user.apiKeys?.tiktok && !user.apiKeys?.youtube && (
                          <span className="text-zinc-600 text-xs">None</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {user.banned ? (
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-medium">
                          Banned
                        </span>
                      ) : user.credits > 0 ? (
                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-zinc-700/50 text-zinc-400 rounded text-xs font-medium">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-zinc-500 text-xs">{user.createdAt}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setSelectedUser(user)
                            setShowUserModal(true)
                          }}
                          className="p-2 hover:bg-zinc-700 rounded-lg transition text-zinc-400 hover:text-white"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user)
                            setShowCreditModal(true)
                          }}
                          className="p-2 hover:bg-zinc-700 rounded-lg transition text-emerald-400"
                          title="Add Credits"
                        >
                          <Coins className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleBan(user)}
                          className={`p-2 hover:bg-zinc-700 rounded-lg transition ${user.banned ? 'text-emerald-400' : 'text-yellow-400'}`}
                          title={user.banned ? 'Unban User' : 'Ban User'}
                        >
                          {user.banned ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-2 hover:bg-zinc-700 rounded-lg transition text-red-400"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center">
                    <Users className="w-10 h-10 text-zinc-700 mx-auto mb-2" />
                    <p className="text-zinc-500 text-sm">No users found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                  <span className="text-white font-medium">
                    {selectedUser.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedUser.name}</h3>
                  <p className="text-zinc-500 text-sm">{selectedUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-zinc-500 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <p className="text-zinc-500 text-xs mb-1">Credits</p>
                  <p className="text-white font-semibold">{(selectedUser.credits || 0).toLocaleString()}</p>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <p className="text-zinc-500 text-xs mb-1">Total Requests</p>
                  <p className="text-white font-semibold">{(selectedUser.totalRequests || 0).toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-zinc-800/50 rounded-lg p-3">
                <p className="text-zinc-500 text-xs mb-2">API Keys</p>
                {selectedUser.apiKeys?.tiktok && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-zinc-400">TikTok:</span>
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-emerald-400 bg-zinc-900 px-2 py-1 rounded">
                        {selectedUser.apiKeys.tiktok.substring(0, 20)}...
                      </code>
                      <button
                        onClick={() => copyToClipboard(selectedUser.apiKeys.tiktok)}
                        className="text-zinc-500 hover:text-white"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
                {selectedUser.apiKeys?.youtube && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400">YouTube:</span>
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-emerald-400 bg-zinc-900 px-2 py-1 rounded">
                        {selectedUser.apiKeys.youtube.substring(0, 20)}...
                      </code>
                      <button
                        onClick={() => copyToClipboard(selectedUser.apiKeys.youtube)}
                        className="text-zinc-500 hover:text-white"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
                {!selectedUser.apiKeys?.tiktok && !selectedUser.apiKeys?.youtube && (
                  <p className="text-zinc-600 text-sm">No API keys generated</p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Status</span>
                {selectedUser.banned ? (
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">Banned</span>
                ) : (
                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">Active</span>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Role</span>
                <span className="text-white">{selectedUser.isAdmin ? 'Admin' : 'User'}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Joined</span>
                <span className="text-white">{selectedUser.createdAt}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowUserModal(false)
                  setShowCreditModal(true)
                }}
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-all text-sm"
              >
                Add Credits
              </button>
              <button
                onClick={() => setShowUserModal(false)}
                className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-all text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Credits Modal */}
      {showCreditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-1">Add Credits</h3>
            <p className="text-zinc-500 text-sm mb-6">
              Add credits to <span className="text-white">{selectedUser.name}</span>'s account
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Credit Amount
              </label>
              <input
                type="number"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-3 px-4 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
                min="1"
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {[100, 500, 1000, 5000, 10000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setCreditAmount(amount.toString())}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm text-zinc-300 transition"
                  >
                    +{amount.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCreditModal(false)
                  setSelectedUser(null)
                  setCreditAmount('')
                }}
                className="flex-1 py-3 bg-zinc-800 text-white rounded-lg font-medium hover:bg-zinc-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCredits}
                disabled={!creditAmount || actionLoading}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
              >
                {actionLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Coins className="w-4 h-4" />
                    Add Credits
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
