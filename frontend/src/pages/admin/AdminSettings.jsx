import { useState, useEffect } from 'react'
import api from '../../utils/api'
import { 
  Settings, 
  Shield, 
  Key,
  Save,
  AlertCircle,
  CheckCircle,
  Loader2,
  ToggleLeft,
  ToggleRight,
  RefreshCw
} from 'lucide-react'

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    requireApiKey: true,
    freeCredits: 25,
    creditCost: 1,
    maintenanceMode: false
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await api.get('/admin/settings')
      if (response.data.success) {
        setSettings(response.data.settings)
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await api.put('/admin/settings', settings)
      if (response.data.success) {
        setSuccess('Settings saved successfully!')
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Admin Settings</h1>
          <p className="text-gray-400">
            Configure API settings and platform behavior
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 px-6 py-3 gradient-bg text-white rounded-xl font-semibold btn-hover disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Save Changes</span>
            </>
          )}
        </button>
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

      <div className="space-y-6">
        {/* API Settings */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Key className="w-5 h-5 text-primary-400" />
            <h2 className="text-lg font-semibold text-white">API Settings</h2>
          </div>

          <div className="space-y-6">
            {/* Require API Key */}
            <div className="flex items-center justify-between p-4 bg-dark-900 rounded-xl">
              <div>
                <h4 className="text-white font-medium">Require API Key</h4>
                <p className="text-gray-400 text-sm">When enabled, all API requests require a valid API key</p>
              </div>
              <button
                onClick={() => toggleSetting('requireApiKey')}
                className="text-primary-400"
              >
                {settings.requireApiKey ? (
                  <ToggleRight className="w-10 h-10" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-gray-500" />
                )}
              </button>
            </div>

            {/* Credit Cost */}
            <div className="p-4 bg-dark-900 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-white font-medium">Credit Cost per Request</h4>
                  <p className="text-gray-400 text-sm">Number of credits deducted per successful API request</p>
                </div>
              </div>
              <input
                type="number"
                value={settings.creditCost}
                onChange={(e) => setSettings({ ...settings, creditCost: parseInt(e.target.value) || 1 })}
                min="1"
                className="w-32 bg-dark-800 border border-dark-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-primary-500"
              />
            </div>

            {/* Free Credits */}
            <div className="p-4 bg-dark-900 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-white font-medium">Free Credits for New Users</h4>
                  <p className="text-gray-400 text-sm">Credits given to new users upon registration</p>
                </div>
              </div>
              <input
                type="number"
                value={settings.freeCredits}
                onChange={(e) => setSettings({ ...settings, freeCredits: parseInt(e.target.value) || 0 })}
                min="0"
                className="w-32 bg-dark-800 border border-dark-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Settings className="w-5 h-5 text-primary-400" />
            <h2 className="text-lg font-semibold text-white">System Settings</h2>
          </div>

          <div className="space-y-6">
            {/* Maintenance Mode */}
            <div className="flex items-center justify-between p-4 bg-dark-900 rounded-xl">
              <div>
                <h4 className="text-white font-medium">Maintenance Mode</h4>
                <p className="text-gray-400 text-sm">When enabled, all API requests will return a maintenance message</p>
              </div>
              <button
                onClick={() => toggleSetting('maintenanceMode')}
                className={settings.maintenanceMode ? 'text-yellow-400' : 'text-gray-500'}
              >
                {settings.maintenanceMode ? (
                  <ToggleRight className="w-10 h-10" />
                ) : (
                  <ToggleLeft className="w-10 h-10" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-dark-800 border border-red-500/30 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="w-5 h-5 text-red-400" />
            <h2 className="text-lg font-semibold text-red-400">Danger Zone</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-dark-900 rounded-xl">
              <div>
                <h4 className="text-white font-medium">Clear All Usage Data</h4>
                <p className="text-gray-400 text-sm">Reset all usage statistics and request logs</p>
              </div>
              <button
                onClick={() => {
                  if (confirm('Are you sure? This will permanently delete all usage data.')) {
                    // Handle clear data
                  }
                }}
                className="px-4 py-2 bg-red-500/20 border border-red-500 text-red-400 rounded-lg font-medium hover:bg-red-500/30 transition"
              >
                Clear Data
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-dark-900 rounded-xl">
              <div>
                <h4 className="text-white font-medium">Invalidate All API Keys</h4>
                <p className="text-gray-400 text-sm">Force all users to regenerate their API keys</p>
              </div>
              <button
                onClick={() => {
                  if (confirm('Are you sure? All users will need to regenerate their API keys.')) {
                    // Handle invalidate keys
                  }
                }}
                className="px-4 py-2 bg-red-500/20 border border-red-500 text-red-400 rounded-lg font-medium hover:bg-red-500/30 transition flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Invalidate</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
