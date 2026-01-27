import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Zap, Menu, X, Sun, Moon, MessageCircle } from 'lucide-react'
import { useState } from 'react'

// Custom X (Twitter) icon
const XIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

// Telegram icon
const TelegramIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
)

export default function MainLayout() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Pricing', path: '/#pricing' },
    { name: 'Docs', path: '/docs' },
  ]

  const footerLinks = {
    product: [
      { name: 'Documentation', path: '/docs' },
      { name: 'Pricing', path: '/#pricing' },
      { name: 'API Status', path: '/status' },
      { name: 'Changelog', path: '/changelog' },
    ],
    company: [
      { name: 'About', path: '/about' },
      { name: 'Blog', path: '/blog' },
      { name: 'Contact', path: '/contact' },
      { name: 'Careers', path: '/careers' },
    ],
    legal: [
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Cookie Policy', path: '/cookies' },
    ],
  }

  const socialLinks = [
    { name: 'X (Twitter)', href: 'https://twitter.com/th3_idle_dev', icon: XIcon },
    { name: 'Telegram', href: 'https://t.me/theidledeveloper', icon: TelegramIcon },
    { name: 'Support', href: 'https://t.me/iDevSupportBot', icon: MessageCircle },
  ]

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#09090b]' : 'bg-white'}`}>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b ${
        theme === 'dark' 
          ? 'bg-[#09090b]/80 border-zinc-900' 
          : 'bg-white/80 border-zinc-200'
      }`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                theme === 'dark' ? 'bg-white' : 'bg-black'
              }`}>
                <Zap className={`w-5 h-5 ${theme === 'dark' ? 'text-black' : 'text-white'}`} />
              </div>
              <span className={`text-base font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                IdleDeveloper
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition ${
                    location.pathname === link.path
                      ? theme === 'dark' ? 'text-white' : 'text-black'
                      : theme === 'dark' ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-4">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition ${
                  theme === 'dark' 
                    ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' 
                    : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
                }`}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {user ? (
                <Link 
                  to="/dashboard" 
                  className={`font-medium px-5 py-2 rounded-lg transition-all text-sm ${
                    theme === 'dark' 
                      ? 'bg-white hover:bg-zinc-100 text-black' 
                      : 'bg-black hover:bg-zinc-800 text-white'
                  }`}
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`text-sm font-medium transition ${
                      theme === 'dark' ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-black'
                    }`}
                  >
                    Sign in
                  </Link>
                  <Link 
                    to="/register" 
                    className={`font-medium px-5 py-2 rounded-lg transition-all text-sm ${
                      theme === 'dark' 
                        ? 'bg-white hover:bg-zinc-100 text-black' 
                        : 'bg-black hover:bg-zinc-800 text-white'
                    }`}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition ${
                  theme === 'dark' 
                    ? 'text-zinc-400 hover:text-white' 
                    : 'text-zinc-600 hover:text-black'
                }`}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                className={`transition-colors ${
                  theme === 'dark' ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-black'
                }`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-t ${
            theme === 'dark' ? 'bg-[#09090b] border-zinc-900' : 'bg-white border-zinc-200'
          }`}>
            <div className="px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block text-base font-medium ${
                    theme === 'dark' ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-black'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className={`pt-4 border-t ${theme === 'dark' ? 'border-zinc-800' : 'border-zinc-200'}`}>
                {user ? (
                  <Link
                    to="/dashboard"
                    className={`block w-full font-medium py-3 rounded-lg text-center ${
                      theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      className={`block text-base font-medium ${
                        theme === 'dark' ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-black'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/register"
                      className={`block w-full font-medium py-3 rounded-lg text-center ${
                        theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className={`border-t ${
        theme === 'dark' ? 'border-zinc-900 bg-zinc-950' : 'border-zinc-200 bg-zinc-50'
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2">
              <Link to="/" className="flex items-center gap-2.5 mb-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  theme === 'dark' ? 'bg-white' : 'bg-black'
                }`}>
                  <Zap className={`w-4 h-4 ${theme === 'dark' ? 'text-black' : 'text-white'}`} />
                </div>
                <span className={`text-base font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  IdleDeveloper
                </span>
              </Link>
              <p className={`text-sm mb-6 max-w-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-600'}`}>
                Powerful APIs for modern developers. Build amazing applications with our reliable infrastructure.
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                      theme === 'dark' 
                        ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white' 
                        : 'bg-zinc-200 hover:bg-zinc-300 text-zinc-600 hover:text-black'
                    }`}
                    title={item.name}
                  >
                    <item.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className={`text-sm font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                Product
              </h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path} 
                      className={`text-sm transition ${
                        theme === 'dark' ? 'text-zinc-500 hover:text-white' : 'text-zinc-600 hover:text-black'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className={`text-sm font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                Company
              </h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path} 
                      className={`text-sm transition ${
                        theme === 'dark' ? 'text-zinc-500 hover:text-white' : 'text-zinc-600 hover:text-black'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className={`text-sm font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                Legal
              </h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path} 
                      className={`text-sm transition ${
                        theme === 'dark' ? 'text-zinc-500 hover:text-white' : 'text-zinc-600 hover:text-black'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className={`pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 ${
            theme === 'dark' ? 'border-zinc-900' : 'border-zinc-200'
          }`}>
            <p className={`text-sm ${theme === 'dark' ? 'text-zinc-600' : 'text-zinc-500'}`}>
              © {new Date().getFullYear()} IdleDeveloper. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link 
                to="/terms" 
                className={`text-sm transition ${
                  theme === 'dark' ? 'text-zinc-500 hover:text-white' : 'text-zinc-600 hover:text-black'
                }`}
              >
                Terms
              </Link>
              <Link 
                to="/privacy" 
                className={`text-sm transition ${
                  theme === 'dark' ? 'text-zinc-500 hover:text-white' : 'text-zinc-600 hover:text-black'
                }`}
              >
                Privacy
              </Link>
              <Link 
                to="/cookies" 
                className={`text-sm transition ${
                  theme === 'dark' ? 'text-zinc-500 hover:text-white' : 'text-zinc-600 hover:text-black'
                }`}
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
