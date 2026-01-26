import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { 
  CheckCircle2, 
  Coins, 
  Zap, 
  MessageCircle,
  Copy,
  ExternalLink,
  ArrowRight
} from 'lucide-react'

export default function Purchase() {
  const { user } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState('starter')
  const [copied, setCopied] = useState(false)

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      credits: 5000,
      price: 2,
      popular: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      credits: 15000,
      price: 5,
      popular: true,
      save: '17%'
    },
    {
      id: 'business',
      name: 'Business',
      credits: 50000,
      price: 15,
      popular: false,
      save: '25%'
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

  const selectedPlanData = plans.find(p => p.id === selectedPlan)

  const getPaymentMessage = (plan) => {
    return encodeURIComponent(
      `Hi! I want to purchase the ${plan.name} plan (${plan.credits.toLocaleString()} credits for $${plan.price}).\n\nMy account email: ${user?.email || 'YOUR_EMAIL'}`
    )
  }

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white mb-1">Purchase Credits</h1>
        <p className="text-sm text-zinc-500">
          Buy credits to continue using the API. No subscription required.
        </p>
      </div>

      {/* Current Balance */}
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
              <Coins className="w-5 h-5 text-zinc-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Current Balance</p>
              <p className="text-xl font-semibold text-white">{(user?.credits || 0).toLocaleString()} credits</p>
            </div>
          </div>
          <p className="text-xs text-zinc-500">1 credit = 1 request</p>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            className={`relative text-left p-4 rounded-xl border transition ${
              selectedPlan === plan.id 
                ? 'bg-white text-black border-white' 
                : 'bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-2 right-3">
                <span className="bg-emerald-500 text-white px-2 py-0.5 rounded text-[10px] font-medium">
                  Popular
                </span>
              </div>
            )}

            <div className="mb-3">
              <h3 className={`text-sm font-medium ${selectedPlan === plan.id ? 'text-black' : 'text-white'}`}>
                {plan.name}
              </h3>
              {plan.save && (
                <span className={`text-[10px] ${selectedPlan === plan.id ? 'text-black/60' : 'text-emerald-400'}`}>
                  Save {plan.save}
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-1">
              <span className={`text-2xl font-semibold ${selectedPlan === plan.id ? 'text-black' : 'text-white'}`}>
                ${plan.price}
              </span>
            </div>
            <p className={`text-xs mt-1 ${selectedPlan === plan.id ? 'text-black/60' : 'text-zinc-500'}`}>
              {plan.credits.toLocaleString()} credits
            </p>
          </button>
        ))}
      </div>

      {/* What's included */}
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-5 mb-6">
        <h3 className="text-sm font-medium text-white mb-3">What's included</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            'TikTok & YouTube access',
            'Credits never expire',
            'Priority support',
            'No hidden fees'
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span className="text-xs text-zinc-400">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment */}
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">Pay via Telegram</h3>
            <p className="text-xs text-zinc-500">Contact us to complete your purchase</p>
          </div>
        </div>

        <div className="space-y-3 mb-5">
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <span className="w-5 h-5 bg-zinc-800 rounded flex items-center justify-center text-[10px] font-medium text-white">1</span>
            Select your plan above
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <span className="w-5 h-5 bg-zinc-800 rounded flex items-center justify-center text-[10px] font-medium text-white">2</span>
            Click the button below to message us
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <span className="w-5 h-5 bg-zinc-800 rounded flex items-center justify-center text-[10px] font-medium text-white">3</span>
            Credits added within minutes
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-black rounded-lg mb-4">
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
          href={`${telegramLink}?text=${getPaymentMessage(selectedPlanData)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full py-2.5"
        >
          <MessageCircle className="w-4 h-4" />
          Purchase {selectedPlanData?.name} - ${selectedPlanData?.price}
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  )
}
