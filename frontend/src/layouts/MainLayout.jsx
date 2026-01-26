import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Zap, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function MainLayout() {
  const { user } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Docs', path: '/docs' },
  ]

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-black" />
              </div>
              <span className="text-sm font-semibold text-white">
                IdleDeveloper
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm transition ${
                    location.pathname === link.path
                      ? 'text-white'
                      : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Auth buttons */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <Link to="/dashboard" className="btn-primary px-4 py-1.5 text-sm">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm text-zinc-400 hover:text-white transition"
                  >
                    Sign in
                  </Link>
                  <Link to="/register" className="btn-primary px-4 py-1.5 text-sm">
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-zinc-400"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#09090b] border-t border-zinc-900">
            <div className="px-6 py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block text-sm text-zinc-400 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-zinc-800">
                {user ? (
                  <Link
                    to="/dashboard"
                    className="btn-primary w-full py-2 text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      className="block text-sm text-zinc-400 hover:text-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/register"
                      className="btn-primary w-full py-2 text-sm"
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
      <main className="pt-14">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-12 mt-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                <Zap className="w-3 h-3 text-black" />
              </div>
              <span className="text-sm text-zinc-500">IdleDeveloper API</span>
            </div>
            
            <div className="flex items-center gap-6">
              <Link to="/docs" className="text-sm text-zinc-500 hover:text-white transition">
                Documentation
              </Link>
              <Link to="/pricing" className="text-sm text-zinc-500 hover:text-white transition">
                Pricing
              </Link>
              <a 
                href="https://t.me/theidledeveloper" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-zinc-500 hover:text-white transition"
              >
                Contact
              </a>
            </div>
            
            <p className="text-sm text-zinc-600">
              © 2025 IdleDeveloper
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
