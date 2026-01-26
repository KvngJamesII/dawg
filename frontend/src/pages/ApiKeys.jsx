import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import { 
  Key, 
  Copy, 
  CheckCircle2, 
  RefreshCw, 
  Eye, 
  EyeOff,
  AlertCircle,
  Loader2,
  Plus
} from 'lucide-react'

export default function ApiKeys() {
  const { user, fetchUser } = useAuth()
  const [regenerating, setRegenerating] = useState(null)
  const [copiedKey, setCopiedKey] = useState(null)
  const [visibleKeys, setVisibleKeys] = useState({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const services = [
    {
      id: 'tiktok',
      name: 'TikTok',
      description: 'Download videos without watermark',
      endpoint: '/api/tiktok'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      description: 'Extract audio from videos',
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
        setSuccess(`${service.charAt(0).toUpperCase() + service.slice(1)} API key generated!`)
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate API key')
    } finally {
      setRegenerating(null)
    }
  }

  const regenerateKey = async (service) => {
    if (!confirm(`Regenerate ${service} key? The old key will stop working immediately.`)) {
      return
    }

    setRegenerating(service)
    setError('')
    setSuccess('')

    try {
      const response = await api.post(`/user/api-keys/${service}/regenerate`)
      if (response.data.success) {
        await fetchUser()
        setSuccess(`${service.charAt(0).toUpperCase() + service.slice(1)} API key regenerated!`)
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
    return key.slice(0, 12) + '•'.repeat(16) + key.slice(-6)
  }

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white mb-1">API Keys</h1>
        <p className="text-sm text-zinc-500">
          Manage your API keys for each service.
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-start gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <p className="text-emerald-400 text-sm">{success}</p>
        </div>
      )}

      {/* API Keys List */}
      <div className="space-y-4">
        {services.map((service) => {
          const apiKey = user?.apiKeys?.[service.id]
          const isVisible = visibleKeys[service.id]
          const isRegenerating = regenerating === service.id

          return (
            <div
              key={service.id}
              className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-5"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
                    <Key className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white">{service.name} API</h3>
                    <p className="text-xs text-zinc-500">{service.description}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${apiKey ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
                  {apiKey ? 'Active' : 'Inactive'}
                </span>
              </div>

              {apiKey ? (
                <>
                  <div className="bg-black rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between gap-3">
                      <code className="text-sm text-zinc-400 font-mono break-all flex-1">
                        {isVisible ? apiKey : maskKey(apiKey)}
                      </code>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => toggleKeyVisibility(service.id)}
                          className="p-1.5 hover:bg-zinc-800 rounded transition"
                          title={isVisible ? 'Hide key' : 'Show key'}
                        >
                          {isVisible ? (
                            <EyeOff className="w-4 h-4 text-zinc-500" />
                          ) : (
                            <Eye className="w-4 h-4 text-zinc-500" />
                          )}
                        </button>
                        <button
                          onClick={() => copyToClipboard(apiKey, service.id)}
                          className="p-1.5 hover:bg-zinc-800 rounded transition"
                          title="Copy key"
                        >
                          {copiedKey === service.id ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-zinc-500" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-zinc-500">
                      Endpoint: <code className="text-zinc-400">{service.endpoint}</code>
                    </div>
                    <button
                      onClick={() => regenerateKey(service.id)}
                      disabled={isRegenerating}
                      className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition disabled:opacity-50"
                    >
                      {isRegenerating ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <RefreshCw className="w-3 h-3" />
                      )}
                      Regenerate
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => generateKey(service.id)}
                  disabled={isRegenerating}
                  className="btn-primary w-full py-2 text-sm"
                >
                  {isRegenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Generate API Key
                    </>
                  )}
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Usage Example */}
      <div className="mt-8 bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-5">
        <h3 className="text-sm font-medium text-white mb-3">Usage Example</h3>
        <div className="bg-black rounded-lg p-3">
          <pre className="text-xs text-zinc-400 overflow-x-auto">
            <code>
{`curl -X GET "https://api.idledeveloper.tech/api/tiktok?url=VIDEO_URL" \\
  -H "X-API-Key: YOUR_API_KEY"`}
            </code>
          </pre>
        </div>
        <p className="text-xs text-zinc-500 mt-3">
          Include your API key in the <code className="text-zinc-400">X-API-Key</code> header with every request.
        </p>
      </div>
    </div>
  )
}
