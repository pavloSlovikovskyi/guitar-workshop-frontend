import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout, setRole } from './store/slices/authSlice'
import { authService } from './api/authService'
import Instruments from './pages/Instruments.jsx'
import Customers from './pages/Customers.jsx'
import Services from './pages/Services.jsx'
import Passports from './pages/Passports.jsx'
import Orders from './pages/Orders.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ClientOrders from './pages/ClientOrders.jsx'

function ProtectedRoute({ children, allowedRoles }) {
  const dispatch = useDispatch()
  const { isAuthenticated, role } = useSelector((state) => state.auth)
  const [isChecking, setIsChecking] = useState(false)
  const token = localStorage.getItem('token')
  const roleLower = role ? role.toLowerCase() : null

  useEffect(() => {
    let isMounted = true

    const loadProfile = async () => {
      if (!isAuthenticated || role) return

      setIsChecking(true)
      const user = await authService.me()
      console.log('Current user data:', user)

      const resolvedRole =
        user?.role ||
        user?.Role ||
        user?.userRole ||
        user?.user?.role ||
        user?.user?.Role ||
        null

      if (resolvedRole) {
        dispatch(setRole(resolvedRole))
        localStorage.setItem('userRole', resolvedRole)
      } else {
        dispatch(logout())
      }

      if (isMounted) {
        setIsChecking(false)
      }
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [isAuthenticated, role, dispatch])

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (isChecking && !role) {
    return <div>Loading...</div>
  }

  if (!role && isAuthenticated) {
    return <div>Loading...</div>
  }

  if (allowedRoles && roleLower && !allowedRoles.map(r => r.toLowerCase()).includes(roleLower)) {
    return <Navigate to={roleLower === 'master' ? '/admin/orders' : '/orders'} replace />
  }

  return children
}

function AppRoutes() {
  const { isAuthenticated, role } = useSelector((state) => state.auth)
  const roleLower = role ? role.toLowerCase() : null

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Navigate to={roleLower === 'master' ? '/admin/orders' : '/orders'} replace />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute allowedRoles={['Master']}>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instruments"
        element={
          <ProtectedRoute allowedRoles={['Master', 'Customer', 'Client']}>
            <Instruments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customers"
        element={
          <ProtectedRoute allowedRoles={['Master']}>
            <Customers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/services"
        element={
          <ProtectedRoute allowedRoles={['Master']}>
            <Services />
          </ProtectedRoute>
        }
      />
      <Route
        path="/passports"
        element={
          <ProtectedRoute allowedRoles={['Master']}>
            <Passports />
          </ProtectedRoute>
        }
      />

      {/* Client routes */}
      <Route
        path="/orders"
        element={
          <ProtectedRoute allowedRoles={['Customer', 'Client', 'Master']}>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Navigate to={roleLower === 'master' ? '/admin/orders' : '/orders'} replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Navigate to={roleLower === 'master' ? '/admin/orders' : '/orders'} replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-orders"
        element={
          <ProtectedRoute allowedRoles={['Customer', 'Client']}>
            <ClientOrders />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
