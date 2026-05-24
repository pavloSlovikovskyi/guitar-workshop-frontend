import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Instruments from './pages/Instruments.jsx'
import Customers from './pages/Customers.jsx'
import Services from './pages/Services.jsx'
import Passports from './pages/Passports.jsx'
import Orders from './pages/Orders.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'

function AppRoutes() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/" element={<Home />} />
      <Route path="/instruments" element={<Instruments />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/services" element={<Services />} />
      <Route path="/passports" element={<Passports />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
