import { Link, useLocation } from 'react-router-dom'

function Layout({ children }) {
  const location = useLocation()

  const isActive = (path) => location.pathname === path 
    ? "text-emerald-600 font-semibold" 
    : "text-slate-600 hover:text-emerald-600 transition-colors"

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gradient-to-br from-gray-50 to-emerald-50">
      
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 shadow-lg border-b border-emerald-100">
        <nav className="container mx-auto flex items-center justify-between py-4 px-6 max-w-6xl">
          
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl group-hover:scale-105 transition-all shadow-lg">
              <span className="text-2xl">🎸</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800 bg-gradient-to-r from-gray-900 to-emerald-600 bg-clip-text text-transparent">
              Гітарна<span className="text-emerald-600"> майстерня</span>
            </span>
          </Link>

          <div className="flex items-center gap-6">
            {[
              { to: '/', label: 'Головна', icon: '🏠' },
              { to: '/instruments', label: 'Інструменти', icon: '🎸' },
              { to: '/customers', label: 'Клієнти', icon: '👥' },
              { to: '/services', label: 'Послуги', icon: '🛠️' },
              { to: '/passports', label: 'Паспорти', icon: '📋' },
              { to: '/orders', label: 'Замовлення', icon: '📦' }
            ].map(({ to, label, icon }) => (
              <Link 
                key={to}
                to={to} 
                className={`${isActive(to)} flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg hover:bg-emerald-50`}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-2 md:py-4 max-w-6xl">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-100 bg-white/90 py-6 backdrop-blur-md">
        <div className="container mx-auto text-center text-sm text-slate-500 max-w-6xl">
          <p className="mb-2">© 2026 Гітарна майстерня. Всі права захищено.</p>
          <p className="opacity-75 text-xs">React SPA • Redux • Tailwind CSS</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
