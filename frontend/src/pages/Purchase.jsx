import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useSearchParams } from 'react-router-dom'
import api from '../utils/api'
import { 
  CheckCircle2, 
  Coins, 
  Zap, 
  MessageCircle,
  Copy,
  ExternalLink,
  Loader2,
  CreditCard,
  Shield,
  Clock,
  AlertCircle,
  Sparkles,
  X,
  Building2
} from 'lucide-react'

// Paystack Public Key
const PAYSTACK_PUBLIC_KEY = 'pk_live_efa6b01e6086e21bda6762026dcaec02dd4f669a'

// Nigerian pricing in Naira
const NIGERIAN_PACKAGES = [
  { id: 'starter', name: 'Starter', credits: 5000, priceNGN: 2000, priceUSD: 2 },
  { id: 'growth', name: 'Growth', credits: 15000, priceNGN: 6000, priceUSD: 5 },
  { id: 'pro', name: 'Pro', credits: 50000, priceNGN: 19000, priceUSD: 15 },
  { id: 'enterprise', name: 'Enterprise', credits: 200000, priceNGN: 75000, priceUSD: 50 }
]

// International pricing in USD
const INTERNATIONAL_PACKAGES = [
  { id: 'starter', name: 'Starter', credits: 5000, priceUSD: 2 },
  { id: 'growth', name: 'Growth', credits: 15000, priceUSD: 5 },
  { id: 'pro', name: 'Pro', credits: 50000, priceUSD: 15 },
  { id: 'enterprise', name: 'Enterprise', credits: 200000, priceUSD: 50 }
]

export default function Purchase() {
  const { user, refreshUser } = useAuth()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [searchParams] = useSearchParams()
  const [selectedPlan, setSelectedPlan] = useState('growth')
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [notification, setNotification] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [isNigeria, setIsNigeria] = useState(false)
  const [countryLoading, setCountryLoading] = useState(true)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState('card')

  // Get packages based on location
  const packages = isNigeria ? NIGERIAN_PACKAGES : INTERNATIONAL_PACKAGES

  useEffect(() => {
    detectCountry()
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

  const detectCountry = async () => {
    try {
      // Using multiple IP detection services with fallback
      const services = [
        'https://ipapi.co/json/',
        'https://ip-api.com/json/',
        'https://ipinfo.io/json'
      ]

      for (const service of services) {
        try {
          const response = await fetch(service, { timeout: 5000 })
          const data = await response.json()
          
          // Different services return country code in different fields
          const countryCode = data.country_code || data.countryCode || data.country
          
          if (countryCode) {
            setIsNigeria(countryCode.toUpperCase() === 'NG')
            break
          }
        } catch (err) {
          continue
        }
      }
    } catch (error) {
      console.error('Failed to detect country:', error)
      // Default to international pricing if detection fails
      setIsNigeria(false)
    } finally {
      setCountryLoading(false)
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

  const handlePurchaseClick = () => {
    if (isNigeria) {
      // Show payment method modal for Nigerian users
      setShowPaymentModal(true)
    } else {
      // For international users, redirect to Telegram
      window.open(`${telegramLink}?text=${getPaymentMessage(selectedPackage)}`, '_blank')
    }
  }

  const handlePaystackPayment = () => {
    if (!user?.email) {
      setNotification({ type: 'error', message: 'Please login to make a payment' })
      return
    }

    setProcessing(true)
    const pkg = selectedPackage
    const amount = pkg.priceNGN * 100 // Paystack expects amount in kobo

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: user.email,
      amount: amount,
      currency: 'NGN',
      channels: [selectedMethod], // 'card' or 'bank_transfer'
      ref: 'IDV_' + Date.now() + '_' + Math.floor(Math.random() * 1000000),
      metadata: {
        custom_fields: [
          {
            display_name: "Customer Name",
            variable_name: "customer_name",
            value: user.name || 'Customer'
          },
          {
            display_name: "Package",
            variable_name: "package",
            value: pkg.name
          },
          {
            display_name: "Credits",
            variable_name: "credits",
            value: pkg.credits.toString()
          },
          {
            display_name: "User ID",
            variable_name: "user_id",
            value: user.id || user.email
          }
        ]
      },
      callback: async function(response) {
        setShowPaymentModal(false)
        setProcessing(false)
        
        try {
          // Verify payment on backend
          const verifyRes = await api.post('/payments/verify-paystack', {
            reference: response.reference,
            packageId: pkg.id,
            credits: pkg.credits,
            amount: pkg.priceNGN,
            currency: 'NGN'
          })

          if (verifyRes.data.success) {
            setNotification({ 
              type: 'success', 
              message: `Payment successful! ${pkg.credits.toLocaleString()} credits have been added to your account.` 
            })
            refreshUser()
            fetchTransactions()
          } else {
            setNotification({ type: 'error', message: 'Payment verification failed. Please contact support.' })
          }
        } catch (error) {
          // Even if verification API fails, show success since Paystack confirmed
          setNotification({ 
            type: 'success', 
            message: `Payment received! Reference: ${response.reference}. Credits will be added shortly.` 
          })
          refreshUser()
        }
      },
      onClose: function() {
        setProcessing(false)
        if (!processing) {
          setNotification({ type: 'info', message: 'Payment cancelled' })
        }
      }
    })

    handler.openIframe()
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
    const priceText = isNigeria ? `₦${pkg?.priceNGN?.toLocaleString()}` : `$${pkg?.priceUSD}`
    return encodeURIComponent(
      `Hi! I want to purchase the ${pkg?.name} plan (${pkg?.credits?.toLocaleString()} credits for ${priceText}).\n\nMy account email: ${user?.email || 'YOUR_EMAIL'}`
    )
  }

  const formatPrice = (pkg) => {
    if (isNigeria) {
      return `₦${pkg.priceNGN.toLocaleString()}`
    }
    return `$${pkg.priceUSD}`
  }

  const getPricePerThousand = (pkg) => {
    if (isNigeria) {
      return `₦${(pkg.priceNGN / pkg.credits * 1000).toFixed(0)}`
    }
    return `$${(pkg.priceUSD / pkg.credits * 1000).toFixed(2)}`
  }

  if (loading || countryLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto mb-3" />
          <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Detecting your location...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className={`text-xl sm:text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          Purchase Credits
        </h1>
        <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
          Buy credits to continue using the API. No subscription required, credits never expire.
        </p>
        {isNigeria && (
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 text-xs rounded-full">
            <span className="text-lg">🇳🇬</span>
            Nigerian pricing available
          </div>
        )}
      </div>

      {/* Notification */}
      {notification && (
        <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
          notification.type === 'success' 
            ? 'bg-emerald-500/10 border border-emerald-500/20' 
            : notification.type === 'info'
            ? 'bg-blue-500/10 border border-blue-500/20'
            : 'bg-red-500/10 border border-red-500/20'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          ) : notification.type === 'info' ? (
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          )}
          <p className={
            notification.type === 'success' ? 'text-emerald-400' : 
            notification.type === 'info' ? 'text-blue-400' : 'text-red-400'
          }>
            {notification.message}
          </p>
          <button 
            onClick={() => setNotification(null)}
            className={`ml-auto ${isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-700'}`}
          >
            ×
          </button>
        </div>
      )}

      {/* Current Balance */}
      <div className={`rounded-2xl p-5 sm:p-6 mb-6 sm:mb-8 ${
        isDark 
          ? 'bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20' 
          : 'bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 sm:w-14 h-12 sm:h-14 rounded-xl flex items-center justify-center ${
              isDark ? 'bg-emerald-500/20' : 'bg-emerald-500/10'
            }`}>
              <Coins className="w-6 sm:w-7 h-6 sm:h-7 text-emerald-500" />
            </div>
            <div>
              <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Current Balance</p>
              <p className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                {(user?.credits || 0).toLocaleString()}
              </p>
              <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>credits available</p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>1 credit = 1 API request</p>
            <p className={`text-xs mt-1 ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>Credits never expire</p>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="mb-6 sm:mb-8">
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          Select a Package
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {packages.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => setSelectedPlan(pkg.id)}
              className={`relative text-left p-4 sm:p-5 rounded-xl border transition-all ${
                selectedPlan === pkg.id 
                  ? 'bg-emerald-500/10 border-emerald-500/50 ring-1 ring-emerald-500/50' 
                  : isDark 
                    ? 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                    : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-sm'
              }`}
            >
              {pkg.id === 'growth' && (
                <div className="absolute -top-2.5 left-3 sm:left-4">
                  <span className="bg-emerald-500 text-white px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Popular
                  </span>
                </div>
              )}

              <div className="mb-3 mt-1">
                <h3 className={`text-sm sm:text-base font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  {pkg.name}
                </h3>
              </div>

              <div className="flex items-baseline gap-1 mb-1 sm:mb-2">
                <span className={`text-xl sm:text-2xl lg:text-3xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  {formatPrice(pkg)}
                </span>
              </div>
              
              <p className={`text-xs sm:text-sm mb-3 sm:mb-4 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                {pkg.credits.toLocaleString()} credits
              </p>

              <div className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
                {getPricePerThousand(pkg)} per 1,000
              </div>

              {selectedPlan === pkg.id && (
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                  <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-500" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* What's included */}
      <div className={`rounded-xl p-5 sm:p-6 mb-6 sm:mb-8 ${
        isDark ? 'bg-zinc-900/50 border border-zinc-800' : 'bg-white border border-zinc-200 shadow-sm'
      }`}>
        <h3 className={`text-base font-semibold mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          What's included
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { icon: Zap, text: 'All API endpoints' },
            { icon: Clock, text: 'Credits never expire' },
            { icon: Shield, text: 'Priority support' },
            { icon: CreditCard, text: 'No hidden fees' }
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-2 sm:gap-3">
              <div className={`w-7 sm:w-8 h-7 sm:h-8 rounded-lg flex items-center justify-center ${
                isDark ? 'bg-zinc-800' : 'bg-zinc-100'
              }`}>
                <feature.icon className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-emerald-500" />
              </div>
              <span className={`text-xs sm:text-sm ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                {feature.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Section */}
      <div className={`rounded-xl p-5 sm:p-6 mb-6 sm:mb-8 ${
        isDark ? 'bg-zinc-900/50 border border-zinc-800' : 'bg-white border border-zinc-200 shadow-sm'
      }`}>
        <h3 className={`text-base font-semibold mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          Order Summary
        </h3>

        <div className={`rounded-lg p-4 mb-4 ${isDark ? 'bg-zinc-800/50' : 'bg-zinc-50'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Package</span>
            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              {selectedPackage?.name}
            </span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Credits</span>
            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              {selectedPackage?.credits?.toLocaleString()}
            </span>
          </div>
          <div className={`flex items-center justify-between pt-2 border-t ${isDark ? 'border-zinc-700' : 'border-zinc-200'}`}>
            <span className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Total</span>
            <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              {formatPrice(selectedPackage)}
            </span>
          </div>
        </div>

        <button
          onClick={handlePurchaseClick}
          disabled={processing}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-700 text-white font-medium py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {processing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Pay {formatPrice(selectedPackage)}
            </>
          )}
        </button>

        <p className={`text-xs text-center mt-3 ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
          {isNigeria 
            ? 'Secured by Paystack. Pay with Card or Bank Transfer.'
            : 'Contact us on Telegram to complete your purchase.'
          }
        </p>
      </div>

      {/* Alternative: Telegram Payment */}
      <div className={`rounded-xl p-5 sm:p-6 mb-6 sm:mb-8 ${
        isDark ? 'bg-zinc-900/50 border border-zinc-800' : 'bg-white border border-zinc-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isDark ? 'bg-blue-500/20' : 'bg-blue-500/10'
          }`}>
            <MessageCircle className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Need help or other payment methods?
            </h3>
            <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
              Contact us on Telegram for assistance
            </p>
          </div>
        </div>

        <div className={`flex items-center gap-3 p-3 rounded-lg mb-4 ${
          isDark ? 'bg-zinc-800/50' : 'bg-zinc-50'
        }`}>
          <div className={`flex-1 text-sm font-mono ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
            {telegramUsername}
          </div>
          <button
            onClick={copyUsername}
            className={`p-1 transition ${isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-700'}`}
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

      {/* Transaction History */}
      {transactions.length > 0 && (
        <div className={`rounded-xl p-5 sm:p-6 ${
          isDark ? 'bg-zinc-900/50 border border-zinc-800' : 'bg-white border border-zinc-200 shadow-sm'
        }`}>
          <h3 className={`text-base font-semibold mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            Recent Transactions
          </h3>
          <div className="space-y-3">
            {transactions.slice(0, 5).map((txn) => (
              <div key={txn.id} className={`flex items-center justify-between p-3 rounded-lg ${
                isDark ? 'bg-zinc-800/50' : 'bg-zinc-50'
              }`}>
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    {txn.credits.toLocaleString()} credits
                  </p>
                  <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
                    {new Date(txn.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    {txn.currency} {txn.amount}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    txn.status === 'completed' 
                      ? 'bg-emerald-500/20 text-emerald-500' 
                      : 'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {txn.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setShowPaymentModal(false)}>
          <div 
            className={`w-full max-w-md rounded-2xl p-6 ${isDark ? 'bg-zinc-900' : 'bg-white'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                Select Payment Method
              </h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className={`p-2 rounded-lg transition ${
                  isDark ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-500'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {/* Card Payment Option */}
              <button
                onClick={() => setSelectedMethod('card')}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  selectedMethod === 'card'
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : isDark 
                      ? 'border-zinc-800 hover:border-zinc-700'
                      : 'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  selectedMethod === 'card'
                    ? 'bg-emerald-500 text-white'
                    : isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-500'
                }`}>
                  <CreditCard className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    Pay with Card
                  </p>
                  <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
                    Visa, Mastercard, Verve
                  </p>
                </div>
                {selectedMethod === 'card' && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                )}
              </button>

              {/* Bank Transfer Option */}
              <button
                onClick={() => setSelectedMethod('bank_transfer')}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  selectedMethod === 'bank_transfer'
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : isDark 
                      ? 'border-zinc-800 hover:border-zinc-700'
                      : 'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  selectedMethod === 'bank_transfer'
                    ? 'bg-emerald-500 text-white'
                    : isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-500'
                }`}>
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    Pay with Transfer
                  </p>
                  <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
                    Bank transfer to account
                  </p>
                </div>
                {selectedMethod === 'bank_transfer' && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                )}
              </button>
            </div>

            {/* Order Summary in Modal */}
            <div className={`rounded-lg p-4 mb-6 ${isDark ? 'bg-zinc-800/50' : 'bg-zinc-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {selectedPackage?.name} Plan
                </span>
                <span className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {selectedPackage?.credits?.toLocaleString()} credits
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`font-medium ${isDark ? 'text-white' : 'text-zinc-900'}`}>Total</span>
                <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  ₦{selectedPackage?.priceNGN?.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={handlePaystackPayment}
              disabled={processing}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-700 text-white font-medium py-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {selectedMethod === 'card' ? (
                    <CreditCard className="w-5 h-5" />
                  ) : (
                    <Building2 className="w-5 h-5" />
                  )}
                  Pay ₦{selectedPackage?.priceNGN?.toLocaleString()}
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 mt-4">
              <Shield className="w-4 h-4 text-zinc-500" />
              <span className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
                Secured by Paystack | 256-bit SSL encryption
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
