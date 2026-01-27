import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useSearchParams } from 'react-router-dom'
import api from '../utils/api'
import { 
  CheckCircle2, 
  Coins, 
  Zap, 
  MessageCircle,
  Copy,
  ExternalLink,
  ArrowRight,
  Loader2,
  CreditCard,
  Shield,
  Clock,
  AlertCircle,
  Sparkles
} from 'lucide-react'

export default function Purchase() {
  const { user, refreshUser } = useAuth()
  const [searchParams] = useSearchParams()
  const [selectedPlan, setSelectedPlan] = useState('growth')
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [paystackConfigured, setPaystackConfigured] = useState(false)
  const [copied, setCopied] = useState(false)
  const [notification, setNotification] = useState(null)
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    fetchPackages()
    fetchTransactions()
    
    // Check for success/error from callback
    const success = searchParams.get('success')
    const error = searchParams.get('error')
    
    if (success === 'true') {
      setNotification({ type: 'success', message: 'Payment successful! Credits have been added to your account.' })
      refreshUser()
    } else if (error) {
      const errorMessages = {
        'no_reference': 'No payment reference found',
        'payment_failed': 'Payment was not successful',
        'verification_failed': 'Could not verify payment'
      }
      setNotification({ type: 'error', message: errorMessages[error] || 'Payment failed' })
    }
  }, [searchParams])

  const fetchPackages = async () => {
    try {
      const [packagesRes, configRes] = await Promise.all([
        api.get('/payments/packages'),
        api.get('/payments/config')
      ])
      
      if (packagesRes.data.success) {
        setPackages(packagesRes.data.packages)
      }
      
      if (configRes.data.success) {
        setPaystackConfigured(configRes.data.configured)
      }
    } catch (error) {
      console.error('Failed to fetch packages:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/payments/transactions')
      if (res.data.success) {
        setTransactions(res.data.transactions)
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    }
  }

  const handlePaystackPayment = async () => {
    setProcessing(true)
    try {
      const res = await api.post('/payments/initialize', { packageId: selectedPlan })
      
      if (res.data.success && res.data.authorizationUrl) {
        window.location.href = res.data.authorizationUrl
      } else {
        setNotification({ type: 'error', message: 'Failed to initialize payment' })
      }
    } catch (error) {
      setNotification({ 
        type: 'error', 
        message: error.response?.data?.error || 'Failed to process payment' 
      })
    } finally {
      setProcessing(false)
    }
  }

  const telegramUsername = '@theidledeveloper'
  const telegramLink = 'https://t.me/theidledeveloper'

  const copyUsername = async () => {
    try {
      await navigator.clipboard.writeText(telegramUsername)
    } catch (err) {
      const textarea = document.createElement('textarea')
      textarea.value = telegramUsername
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const selectedPackage = packages.find(p => p.id === selectedPlan) || packages[0]

  const getPaymentMessage = (pkg) => {
    return encodeURIComponent(
      `Hi! I want to purchase the ${pkg?.name} plan (${pkg?.credits?.toLocaleString()} credits for $${pkg?.priceUSD}).\n\nMy account email: ${user?.email || 'YOUR_EMAIL'}`
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Purchase Credits</h1>
        <p className="text-zinc-400">
          Buy credits to continue using the API. No subscription required, credits never expire.
        </p>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
          notification.type === 'success' 
            ? 'bg-emerald-500/10 border border-emerald-500/20' 
            : 'bg-red-500/10 border border-red-500/20'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <p className={notification.type === 'success' ? 'text-emerald-400' : 'text-red-400'}>
              {notification.message}
            </p>
          </div>
          <button 
            onClick={() => setNotification(null)}
            className="ml-auto text-zinc-500 hover:text-white"
          >
            ×
          </button>
        </div>
      )}

      {/* Current Balance */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <Coins className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Current Balance</p>
              <p className="text-3xl font-bold text-white">{(user?.credits || 0).toLocaleString()}</p>
              <p className="text-xs text-zinc-500">credits available</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-zinc-400">1 credit = 1 API request</p>
            <p className="text-xs text-zinc-500 mt-1">Credits never expire</p>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Select a Package</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {packages.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => setSelectedPlan(pkg.id)}
              className={`relative text-left p-5 rounded-xl border transition-all ${
                selectedPlan === pkg.id 
                  ? 'bg-emerald-500/10 border-emerald-500/50 ring-1 ring-emerald-500/50' 
                  : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {pkg.id === 'growth' && (
                <div className="absolute -top-2.5 left-4">
                  <span className="bg-emerald-500 text-white px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Popular
                  </span>
                </div>
              )}

              <div className="mb-4 mt-1">
                <h3 className="text-base font-semibold text-white">{pkg.name}</h3>
              </div>

              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-bold text-white">${pkg.priceUSD}</span>
              </div>
              
              <p className="text-sm text-zinc-400 mb-4">
                {pkg.credits.toLocaleString()} credits
              </p>

              <div className="text-xs text-zinc-500">
                ${(pkg.priceUSD / pkg.credits * 1000).toFixed(2)} per 1,000 requests
              </div>

              {selectedPlan === pkg.id && (
                <div className="absolute top-4 right-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* What's included */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-8">
        <h3 className="text-base font-semibold text-white mb-4">What's included</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Zap, text: 'All API endpoints' },
            { icon: Clock, text: 'Credits never expire' },
            { icon: Shield, text: 'Priority support' },
            { icon: CreditCard, text: 'No hidden fees' }
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center">
                <feature.icon className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-sm text-zinc-300">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Paystack Payment */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Pay with Card</h3>
              <p className="text-xs text-zinc-500">Secure payment via Paystack</p>
            </div>
          </div>

          {paystackConfigured ? (
            <>
              <div className="bg-zinc-800/50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-zinc-400">Package</span>
                  <span className="text-sm text-white font-medium">{selectedPackage?.name}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-zinc-400">Credits</span>
                  <span className="text-sm text-white font-medium">{selectedPackage?.credits?.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-zinc-700">
                  <span className="text-sm text-zinc-400">Total</span>
                  <span className="text-lg text-white font-bold">${selectedPackage?.priceUSD}</span>
                </div>
              </div>

              <button
                onClick={handlePaystackPayment}
                disabled={processing}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-700 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Pay ${selectedPackage?.priceUSD}
                  </>
                )}
              </button>

              <p className="text-xs text-zinc-500 text-center mt-3">
                Secured by Paystack. We accept Visa, Mastercard, and more.
              </p>
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-zinc-400 text-sm mb-2">Card payments coming soon</p>
              <p className="text-zinc-500 text-xs">Use Telegram payment for now</p>
            </div>
          )}
        </div>

        {/* Telegram Payment */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Pay via Telegram</h3>
              <p className="text-xs text-zinc-500">Manual payment with instant delivery</p>
            </div>
          </div>

          <div className="space-y-3 mb-5">
            <div className="flex items-center gap-3 text-sm text-zinc-400">
              <span className="w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center text-xs font-medium text-white">1</span>
              Select your plan above
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-400">
              <span className="w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center text-xs font-medium text-white">2</span>
              Click the button below to message us
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-400">
              <span className="w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center text-xs font-medium text-white">3</span>
              Credits added within minutes
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg mb-4">
            <div className="flex-1 text-sm text-zinc-300 font-mono">
              {telegramUsername}
            </div>
            <button
              onClick={copyUsername}
              className="text-zinc-500 hover:text-white transition p-1"
            >
              {copied ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          <a
            href={`${telegramLink}?text=${getPaymentMessage(selectedPackage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Message on Telegram
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Transaction History */}
      {transactions.length > 0 && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-base font-semibold text-white mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {transactions.slice(0, 5).map((txn) => (
              <div key={txn.id} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                <div>
                  <p className="text-sm text-white font-medium">{txn.credits.toLocaleString()} credits</p>
                  <p className="text-xs text-zinc-500">{new Date(txn.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white">{txn.currency} {txn.amount}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    txn.status === 'completed' 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {txn.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
