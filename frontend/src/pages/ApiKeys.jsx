import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import { 
  Key, 
  Copy, 
  CheckCircle, 
  RefreshCw, 
  Eye, 
  EyeOff,
  AlertCircle,
  Loader2,
  Plus
} from 'lucide-react'

export default function ApiKeys() {
  const { user, fetchUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [regenerating, setRegenerating] = useState(null)
  const [copiedKey, setCopiedKey] = useState(null)
  const [visibleKeys, setVisibleKeys] = useState({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const services = [
    {
      id: 'tiktok',
      name: 'TikTok',
      description: 'Download TikTok videos without watermark',
      color: 'from-pink-500 to-red-500',
      endpoint: '/api/tiktok'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      description: 'Extract audio from YouTube videos',
      color: 'from-red-500 to-orange-500',
      endpoint: '/api/youtube'
    }
  ]

  const copyToClipboard = async (text, keyId) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    setCopiedKey(keyId)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const toggleKeyVisibility = (keyId) => {
    setVisibleKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }))
  }

  const generateKey = async (service) => {
    setRegenerating(service)
    setError('')
    setSuccess('')

    try {
      const response = await api.post(`/user/api-keys/${service}/generate`)
      if (response.data.success) {
        await fetchUser()
        setSuccess(`${service.charAt(0).toUpperCase() + service.slice(1)} API key generated successfully!`)
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate API key')
    } finally {
      setRegenerating(null)
    }
  }

  const regenerateKey = async (service) => {
    if (!confirm(`Are you sure you want to regenerate your ${service} API key? Your old key will stop working immediately.`)) {
      return
    }

    setRegenerating(service)
    setError('')
    setSuccess('')

    try {
      const response = await api.post(`/user/api-keys/${service}/regenerate`)
      if (response.data.success) {
        await fetchUser()
        setSuccess(`${service.charAt(0).toUpperCase() + service.slice(1)} API key regenerated successfully!`)
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to regenerate API key')
    } finally {
      setRegenerating(null)
    }
  }

  const maskKey = (key) => {
    if (!key) return 'Not generated'
    return key.slice(0, 8) + '•'.repeat(20) + key.slice(-4)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">API Keys</h1>
        <p className="text-gray-400">
          Manage your API keys for each service. Each service has its own unique key.
        </p>
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

      {/* API Keys List */}
      <div className="space-y-6">
        {services.map((service) => {
          const apiKey = user?.apiKeys?.[service.id]
          const isVisible = visibleKeys[service.id]
          const isRegenerating = regenerating === service.id

          return (
            <div
              key={service.id}
              className="bg-dark-800 border border-dark-700 rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${service.color} flex items-center justify-center`}>
                    <Key className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{service.name} API</h3>
                    <p className="text-gray-400 text-sm">{service.description}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${apiKey ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                  {apiKey ? 'Active' : 'Not Generated'}
                </span>
              </div>

              {apiKey ? (
                <>
                  <div className="bg-dark-900 border border-dark-600 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <code className="text-sm text-gray-300 break-all flex-1 mr-4">
                        {isVisible ? apiKey : maskKey(apiKey)}
                      </code>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <button
                          onClick={() => toggleKeyVisibility(service.id)}
                          className="p-2 hover:bg-dark-700 rounded-lg transition"
                          title={isVisible ? 'Hide key' : 'Show key'}
                        >
                          {isVisible ? (
                            <EyeOff className="w-5 h-5 text-gray-400" />
                          ) : (
                            <Eye className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        <button
                          onClick={() => copyToClipboard(apiKey, service.id)}
                          className="p-2 hover:bg-dark-700 rounded-lg transition"
                          title="Copy key"
                        >
                          {copiedKey === service.id ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <Copy className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      Endpoint: <code className="text-primary-400">{service.endpoint}</code>
                    </div>
                    <button
                      onClick={() => regenerateKey(service.id)}
                      disabled={isRegenerating}
                      className="flex items-center space-x-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition disabled:opacity-50"
                    >
                      {isRegenerating ? (
                        <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4 text-gray-400" />
                      )}
                      <span className="text-sm text-gray-300">Regenerate Key</span>
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => generateKey(service.id)}
                  disabled={isRegenerating}
                  className="w-full py-3 border-2 border-dashed border-dark-600 hover:border-primary-500 rounded-xl transition flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isRegenerating ? (
                    <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-400">Generate API Key</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Usage Example */}
      <div className="mt-8 bg-dark-800 border border-dark-700 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">How to Use Your API Key</h3>
        <div className="bg-dark-900 rounded-xl p-4">
          <p className="text-sm text-gray-400 mb-3">Include your API key in requests using one of these methods:</p>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Query Parameter:</p>
              <code className="text-sm text-primary-400">
                GET /api/tiktok?url=VIDEO_URL&key=YOUR_API_KEY
              </code>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Header:</p>
              <code className="text-sm text-primary-400">
                X-API-Key: YOUR_API_KEY
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-400 font-medium text-sm">Keep your API keys secure</p>
            <p className="text-gray-400 text-sm mt-1">
              Never share your API keys publicly or commit them to version control. 
              If you believe a key has been compromised, regenerate it immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
