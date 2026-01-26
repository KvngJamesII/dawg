import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { 
  CheckCircle, 
  Coins, 
  Zap, 
  Crown,
  MessageCircle,
  Copy,
  ExternalLink,
  ArrowRight
} from 'lucide-react'

export default function Purchase() {
  const { user } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [copied, setCopied] = useState(false)

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      credits: 5000,
      price: 2,
      popular: false,
      features: [
        '5,000 API credits',
        'TikTok & YouTube access',
        'No expiration',
        'Basic support'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      credits: 15000,
      price: 5,
      popular: true,
      features: [
        '15,000 API credits',
        'TikTok & YouTube access',
        'No expiration',
        'Priority support',
        'Save 17%'
      ]
    },
    {
      id: 'business',
      name: 'Business',
      credits: 50000,
      price: 15,
      popular: false,
      features: [
        '50,000 API credits',
        'TikTok & YouTube access',
        'No expiration',
        'Priority support',
        'Save 25%',
        'Bulk discount'
      ]
    }
  ]

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

  const getPaymentMessage = (plan) => {
    return encodeURIComponent(
      `Hi! I want to purchase the ${plan.name} plan (${plan.credits.toLocaleString()} credits for $${plan.price}).\n\nMy account email: ${user?.email || 'YOUR_EMAIL'}`
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Purchase Credits</h1>
        <p className="text-gray-400">
          Buy credits to continue using our APIs. No subscription required!
        </p>
      </div>

      {/* Current Balance */}
      <div className="bg-gradient-to-r from-primary-600/20 to-purple-600/20 border border-primary-500/30 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-primary-500/30 flex items-center justify-center">
              <Coins className="w-7 h-7 text-primary-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Current Balance</p>
              <p className="text-3xl font-bold text-white">{(user?.credits || 0).toLocaleString()} <span className="text-lg text-gray-400">credits</span></p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">1 credit = 1 request</p>
            <p className="text-primary-400 text-sm">Credits never expire</p>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-dark-800 border rounded-2xl p-6 cursor-pointer transition-all ${
              selectedPlan === plan.id 
                ? 'border-primary-500 ring-2 ring-primary-500/20' 
                : plan.popular 
                  ? 'border-primary-500/50' 
                  : 'border-dark-700 hover:border-dark-600'
            }`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                  <Crown className="w-3 h-3" />
                  <span>Most Popular</span>
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline justify-center">
                <span className="text-4xl font-bold text-white">${plan.price}</span>
              </div>
              <p className="text-gray-400 mt-1">{plan.credits.toLocaleString()} credits</p>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <div className={`w-full h-1 rounded-full ${selectedPlan === plan.id ? 'bg-primary-500' : 'bg-dark-600'}`} />
          </div>
        ))}
      </div>

      {/* Payment Instructions */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">How to Purchase</h2>
            <p className="text-gray-400 text-sm">Simple & secure payment via Telegram</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-dark-900 rounded-xl p-4">
            <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center mb-3">
              <span className="text-primary-400 font-bold">1</span>
            </div>
            <h4 className="text-white font-medium mb-2">Select a Plan</h4>
            <p className="text-gray-400 text-sm">Choose the credit package that fits your needs</p>
          </div>

          <div className="bg-dark-900 rounded-xl p-4">
            <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center mb-3">
              <span className="text-primary-400 font-bold">2</span>
            </div>
            <h4 className="text-white font-medium mb-2">Contact on Telegram</h4>
            <p className="text-gray-400 text-sm">Message us with your plan and email address</p>
          </div>

          <div className="bg-dark-900 rounded-xl p-4">
            <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center mb-3">
              <span className="text-primary-400 font-bold">3</span>
            </div>
            <h4 className="text-white font-medium mb-2">Get Credits</h4>
            <p className="text-gray-400 text-sm">Credits added to your account within minutes</p>
          </div>
        </div>
      </div>

      {/* Telegram Contact */}
      <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Contact on Telegram</h3>
              <div className="flex items-center space-x-2">
                <code className="text-blue-400">{telegramUsername}</code>
                <button
                  onClick={copyUsername}
                  className="p-1 hover:bg-dark-700 rounded transition"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {selectedPlan && (
              <a
                href={`${telegramLink}?text=${getPaymentMessage(plans.find(p => p.id === selectedPlan))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 gradient-bg text-white rounded-xl font-semibold btn-hover flex items-center justify-center space-x-2"
              >
                <span>Buy {plans.find(p => p.id === selectedPlan)?.name} Plan</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            )}
            <a
              href={telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Open Telegram</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Payment Methods Note */}
      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          We accept: PayPal, Crypto (BTC, ETH, USDT), Bank Transfer
        </p>
        <p className="text-gray-500 text-xs mt-1">
          Credits are added manually after payment confirmation. Usually within 5-30 minutes.
        </p>
      </div>
    </div>
  )
}
