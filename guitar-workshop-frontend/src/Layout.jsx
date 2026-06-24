import { Link, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from './store/slices/authSlice'

function Layout({ children }) {
  const location = useLocation()
  const dispatch = useDispatch()
  const role = localStorage.getItem('userRole')?.toLowerCase()
  const isMaster = role === 'master'
  const isCustomer = role === 'customer' || role === 'client'
  const hasReportsPage = false

  const isActive = (path) => location.pathname === path
    ? "text-black font-black underline decoration-4 underline-offset-8"
    : "text-black"

  const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen flex bg-white text-black">
      <aside className="w-64 border-r-2 border-black p-6 flex flex-col justify-between">
        <div>
          <Link to="/" className="text-xl font-black tracking-tighter">
            GT RPRS
          </Link>

          <nav className="mt-10 space-y-2">
            {(isMaster
              ? [
                  { to: '/admin/orders', label: 'Замовлення' },
                  { to: '/customers', label: 'Клієнти' },
                  { to: '/instruments', label: 'Інструменти' },
                  { to: '/passports', label: 'Паспорти інструментів' },
                  { to: '/services', label: 'Послуги' },
                  ...(hasReportsPage ? [{ to: '/reports', label: 'Звіти' }] : [])
                ]
              : isCustomer
              ? [
                  { to: '/orders', label: 'Мої замовлення' },
                  { to: '/instruments', label: 'Інструменти' }
                ]
              : []
            ).map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`${isActive(to)} block text-sm font-bold uppercase tracking-tight py-2`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full bg-white border-2 border-black text-black font-black uppercase text-sm py-3 hover:bg-black hover:text-white transition-all rounded-none"
        >
          Вийти з акаунту
        </button>
      </aside>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout
