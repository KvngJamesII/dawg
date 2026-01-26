import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Zap, Menu, X, Github, Twitter, MessageCircle } from 'lucide-react'
import { useState } from 'react'

export default function MainLayout() {
  const { user } = useAuth()
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
    social: [
      { name: 'Twitter', href: 'https://twitter.com/idledeveloper', icon: Twitter },
      { name: 'GitHub', href: 'https://github.com/idledeveloper', icon: Github },
      { name: 'Telegram', href: 'https://t.me/theidledeveloper', icon: MessageCircle },
    ]
  }

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-zinc-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-black" />
              </div>
              <span className="text-base font-semibold text-white">
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
                      ? 'text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Auth buttons */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <Link to="/dashboard" className="bg-white hover:bg-zinc-100 text-black font-medium px-5 py-2 rounded-lg transition-all text-sm">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm text-zinc-400 hover:text-white font-medium transition"
                  >
                    Sign in
                  </Link>
                  <Link to="/register" className="bg-white hover:bg-zinc-100 text-black font-medium px-5 py-2 rounded-lg transition-all text-sm">
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-zinc-400 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#09090b] border-t border-zinc-900">
            <div className="px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block text-base text-zinc-400 hover:text-white font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-zinc-800">
                {user ? (
                  <Link
                    to="/dashboard"
                    className="block w-full bg-white text-black font-medium py-3 rounded-lg text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      className="block text-base text-zinc-400 hover:text-white font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full bg-white text-black font-medium py-3 rounded-lg text-center"
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
      <footer className="border-t border-zinc-900 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2">
              <Link to="/" className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-black" />
                </div>
                <span className="text-base font-semibold text-white">IdleDeveloper</span>
              </Link>
              <p className="text-sm text-zinc-500 mb-6 max-w-xs">
                Powerful APIs for modern developers. Build amazing applications with our reliable infrastructure.
              </p>
              <div className="flex items-center gap-4">
                {footerLinks.social.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
                  >
                    <item.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-sm text-zinc-500 hover:text-white transition">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-sm text-zinc-500 hover:text-white transition">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-sm text-zinc-500 hover:text-white transition">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-zinc-600">
              © {new Date().getFullYear()} IdleDeveloper. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/terms" className="text-sm text-zinc-500 hover:text-white transition">
                Terms
              </Link>
              <Link to="/privacy" className="text-sm text-zinc-500 hover:text-white transition">
                Privacy
              </Link>
              <Link to="/cookies" className="text-sm text-zinc-500 hover:text-white transition">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
