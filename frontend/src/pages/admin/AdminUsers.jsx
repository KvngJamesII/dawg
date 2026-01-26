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
  Loader2
} from 'lucide-react'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showCreditModal, setShowCreditModal] = useState(false)
  const [creditAmount, setCreditAmount] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

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

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
    
    if (filter === 'all') return matchesSearch
    if (filter === 'active') return matchesSearch && user.credits > 0
    if (filter === 'inactive') return matchesSearch && user.credits === 0
    if (filter === 'banned') return matchesSearch && user.banned
    return matchesSearch
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">User Management</h1>
          <p className="text-gray-400">
            Manage users, add credits, and moderate accounts
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-gray-400">{users.length} total users</span>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <p className="text-green-400 text-sm">{success}</p>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-dark-800 border border-dark-600 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-dark-800 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
        >
          <option value="all">All Users</option>
          <option value="active">Active (Has Credits)</option>
          <option value="inactive">Inactive (No Credits)</option>
          <option value="banned">Banned</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-sm border-b border-dark-600">
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Credits</th>
                <th className="p-4 font-medium">Requests</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Joined</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-dark-700 last:border-0 hover:bg-dark-750">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 flex items-center justify-center">
                          <span className="text-white font-medium">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-gray-500 text-sm">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Coins className="w-4 h-4 text-yellow-500" />
                        <span className="text-white">{user.credits?.toLocaleString() || 0}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">{user.totalRequests || 0}</td>
                    <td className="p-4">
                      {user.banned ? (
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium">
                          Banned
                        </span>
                      ) : user.credits > 0 ? (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-lg text-xs font-medium">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-gray-400 text-sm">{user.createdAt}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user)
                            setShowCreditModal(true)
                          }}
                          className="p-2 hover:bg-dark-600 rounded-lg transition text-green-400"
                          title="Add Credits"
                        >
                          <Coins className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleToggleBan(user)}
                          className={`p-2 hover:bg-dark-600 rounded-lg transition ${user.banned ? 'text-green-400' : 'text-yellow-400'}`}
                          title={user.banned ? 'Unban User' : 'Ban User'}
                        >
                          {user.banned ? <CheckCircle className="w-5 h-5" /> : <Ban className="w-5 h-5" />}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-2 hover:bg-dark-600 rounded-lg transition text-red-400"
                          title="Delete User"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center">
                    <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No users found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Credits Modal */}
      {showCreditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-2">Add Credits</h3>
            <p className="text-gray-400 mb-6">
              Add credits to <span className="text-white">{selectedUser.name}</span>'s account
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Credit Amount
              </label>
              <input
                type="number"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full bg-dark-900 border border-dark-600 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                min="1"
              />
              <div className="flex gap-2 mt-2">
                {[100, 500, 1000, 5000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setCreditAmount(amount.toString())}
                    className="px-3 py-1 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm text-gray-300 transition"
                  >
                    +{amount}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowCreditModal(false)
                  setSelectedUser(null)
                  setCreditAmount('')
                }}
                className="flex-1 py-3 bg-dark-700 text-white rounded-xl font-medium hover:bg-dark-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCredits}
                disabled={!creditAmount || actionLoading}
                className="flex-1 py-3 gradient-bg text-white rounded-xl font-medium btn-hover disabled:opacity-50 flex items-center justify-center"
              >
                {actionLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Add Credits'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
