import { Mail, MessageCircle } from 'lucide-react'

export default function Contact() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold text-white mb-4">Contact Us</h1>
        <p className="text-zinc-400 mb-8">Get in touch for support or inquiries.</p>
        
        <a 
          href="https://t.me/theidledeveloper"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex items-center gap-2 px-6 py-3"
        >
          <MessageCircle className="w-5 h-5" />
          Message on Telegram
        </a>
      </div>
    </div>
  )
}
