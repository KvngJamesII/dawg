import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { 
  Zap, 
  LayoutDashboard, 
  Key, 
  BarChart3, 
  CreditCard, 
  Settings, 
  LogOut,
  Users,
  Coins,
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react'
import { useState } from 'react'

export default function DashboardLayout({ isAdmin = false }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const userNavItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'API Keys', path: '/dashboard/api-keys', icon: Key },
    { name: 'Usage', path: '/dashboard/usage', icon: BarChart3 },
    { name: 'Purchase Credits', path: '/dashboard/purchase', icon: CreditCard },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ]

  const adminNavItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Manage Credits', path: '/admin/credits', icon: Coins },
  ]

  const navItems = isAdmin ? adminNavItems : userNavItems

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-[#09090b]' : 'bg-zinc-50'}`}>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 border-r transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-200 ease-in-out ${
          isDark ? 'bg-black border-zinc-900' : 'bg-white border-zinc-200'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`flex items-center justify-between h-14 px-4 border-b ${
            isDark ? 'border-zinc-900' : 'border-zinc-200'
          }`}>
            <Link to="/" className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                isDark ? 'bg-white' : 'bg-black'
              }`}>
                <Zap className={`w-4 h-4 ${isDark ? 'text-black' : 'text-white'}`} />
              </div>
              <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                {isAdmin ? 'Admin' : 'IdleDev'}
              </span>
            </Link>
            <button
              className={`md:hidden ${isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-900'}`}
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Credits display (for users) */}
          {!isAdmin && (
            <div className={`px-3 py-4 border-b ${isDark ? 'border-zinc-900' : 'border-zinc-200'}`}>
              <div className={`rounded-lg p-3 ${isDark ? 'bg-zinc-900/50' : 'bg-zinc-100'}`}>
                <div className={`text-xs mb-1 ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>Credits</div>
                <div className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{user?.credits || 0}</div>
                <Link
                  to="/dashboard/purchase"
                  className={`mt-2 inline-block text-xs transition ${
                    isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  Buy more →
                </Link>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                    isActive
                      ? isDark 
                        ? 'bg-zinc-800 text-white' 
                        : 'bg-zinc-200 text-zinc-900'
                      : isDark 
                        ? 'text-zinc-500 hover:bg-zinc-900 hover:text-white'
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Switch between admin/user */}
          {user?.isAdmin && (
            <div className={`px-3 py-3 border-t ${isDark ? 'border-zinc-900' : 'border-zinc-200'}`}>
              <Link
                to={isAdmin ? '/dashboard' : '/admin'}
                className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition ${
                  isDark 
                    ? 'text-zinc-500 hover:bg-zinc-900 hover:text-white' 
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{isAdmin ? 'User Dashboard' : 'Admin Panel'}</span>
              </Link>
            </div>
          )}

          {/* User section */}
          <div className={`px-3 py-4 border-t ${isDark ? 'border-zinc-900' : 'border-zinc-200'}`}>
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition w-full ${
                isDark 
                  ? 'text-zinc-500 hover:bg-zinc-900 hover:text-white' 
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 md:ml-60">
        {/* Top bar */}
        <header className={`sticky top-0 z-30 h-14 backdrop-blur-md border-b flex items-center justify-between px-4 md:px-6 ${
          isDark 
            ? 'bg-[#09090b]/80 border-zinc-900' 
            : 'bg-white/80 border-zinc-200'
        }`}>
          <button
            className={`md:hidden ${isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-900'}`}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden md:block">
            <h1 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              {navItems.find((item) => item.path === location.pathname)?.name || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition ${
                isDark 
                  ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' 
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`flex items-center gap-2 transition ${
                  isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium ${
                  isDark ? 'bg-zinc-800 text-white' : 'bg-zinc-200 text-zinc-900'
                }`}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:block text-sm">{user?.name}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className={`absolute right-0 mt-2 w-48 border rounded-lg shadow-xl z-20 ${
                    isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
                  }`}>
                    <div className={`px-4 py-3 border-b ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
                      <div className={`text-sm ${isDark ? 'text-white' : 'text-zinc-900'}`}>{user?.name}</div>
                      <div className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>{user?.email}</div>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/dashboard/settings"
                        className={`block px-4 py-2 text-sm ${
                          isDark 
                            ? 'text-zinc-400 hover:bg-zinc-800 hover:text-white' 
                            : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                        }`}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false)
                          handleLogout()
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          isDark 
                            ? 'text-zinc-400 hover:bg-zinc-800 hover:text-white' 
                            : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                        }`}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
