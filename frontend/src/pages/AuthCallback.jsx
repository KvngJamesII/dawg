import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'

export default function AuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setAuthFromToken } = useAuth()
  const [status, setStatus] = useState('processing') // processing, success, error
  const [message, setMessage] = useState('Completing sign in...')

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token')
      const error = searchParams.get('error')

      if (error) {
        setStatus('error')
        setMessage(decodeURIComponent(error))
        setTimeout(() => navigate('/login'), 3000)
        return
      }

      if (!token) {
        setStatus('error')
        setMessage('No authentication token received')
        setTimeout(() => navigate('/login'), 3000)
        return
      }

      try {
        // Set the token and fetch user data
        await setAuthFromToken(token)
        setStatus('success')
        setMessage('Successfully signed in!')
        setTimeout(() => navigate('/dashboard'), 1500)
      } catch (err) {
        setStatus('error')
        setMessage('Failed to complete authentication')
        setTimeout(() => navigate('/login'), 3000)
      }
    }

    handleCallback()
  }, [searchParams, navigate, setAuthFromToken])

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center">
        {status === 'processing' && (
          <>
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Signing you in...</h2>
            <p className="text-zinc-500">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Welcome!</h2>
            <p className="text-zinc-500">{message}</p>
            <p className="text-zinc-600 text-sm mt-2">Redirecting to dashboard...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Authentication Failed</h2>
            <p className="text-zinc-500">{message}</p>
            <p className="text-zinc-600 text-sm mt-2">Redirecting to login...</p>
          </>
        )}
      </div>
    </div>
  )
}
