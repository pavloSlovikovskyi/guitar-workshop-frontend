import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { loginUser, clearError, setRole, logout } from '../store/slices/authSlice'
import { authService } from '../api/authService'

const getRoleFromToken = (token) => {
  if (!token) return null

  try {
    const decoded = jwtDecode(token)
    return (
      decoded.role ||
      decoded.Role ||
      decoded.roles ||
      decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
      decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/roles'] ||
      null
    )
  } catch {
    return null
  }
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { loading, error } = useSelector((state) => state.auth)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 50))

    try {
      const loginPayload = await dispatch(loginUser({ email, password })).unwrap()
      const token = loginPayload?.token
      if (token) {
        localStorage.setItem('token', token)
      }

      const resolvedRole =
        loginPayload?.role ||
        loginPayload?.Role ||
        loginPayload?.userRole ||
        loginPayload?.user?.role ||
        getRoleFromToken(token)

      if (resolvedRole) {
        localStorage.setItem('userRole', resolvedRole)
      }

      const profile = await authService.me()
      const profileRole =
        profile?.role ||
        profile?.Role ||
        profile?.userRole ||
        profile?.user?.role ||
        null
      const finalRole = profileRole || resolvedRole

      if (finalRole) {
        localStorage.setItem('userRole', finalRole)
      }

      dispatch(setRole(finalRole))
      const roleLower = finalRole ? finalRole.toLowerCase() : null
      navigate(roleLower === 'master' ? '/admin/orders' : '/orders', { replace: true })
    } catch (err) {
      console.error(err)
      dispatch(logout())
      setIsLoading(false)
      navigate('/login', { replace: true })
    }
  }

  const handleErrorClose = () => {
    dispatch(clearError())
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white border-4 border-black p-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Вхід</h1>
          <p className="text-sm font-medium text-black">Вхід в обліковий запис</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-black uppercase text-black mb-2">
              Email адреса
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border-2 border-black p-4 bg-white text-lg rounded-none focus:ring-0 focus:outline-none"
              required
              disabled={loading || isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-black uppercase text-black mb-2">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border-2 border-black p-4 bg-white text-lg rounded-none focus:ring-0 focus:outline-none"
              required
              disabled={loading || isLoading}
            />
          </div>

          {error && (
            <div className="bg-white border-2 border-black p-4 flex items-start justify-between">
              <div>
                <p className="text-sm font-black uppercase">Помилка входу</p>
                <p className="text-sm font-medium text-black mt-1">{error}</p>
              </div>
              <button
                type="button"
                onClick={handleErrorClose}
                className="text-black font-black"
              >
                ✕
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || isLoading || !email || !password}
            className="w-full bg-black text-white border-2 border-black py-3 text-sm font-black uppercase hover:bg-white hover:text-black transition-all rounded-none disabled:opacity-60"
          >
            {loading || isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Вхід...</span>
              </>
            ) : (
              'Увійти'
            )}
          </button>
        </form>

        <p className="text-center text-sm font-medium text-black mt-6">
          Немаєте облікового запису?{' '}
          <Link to="/register" className="font-black underline">
            Зареєструватися
          </Link>
        </p>
      </div>
    </div>
  )
}
