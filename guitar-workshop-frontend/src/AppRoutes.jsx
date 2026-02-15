import {Routes, Route} from 'react-router-dom'
import Instruments from './pages/Instruments.jsx'
import Customers from './pages/Customers.jsx'
import Services from './pages/Services.jsx'
import Passports from './pages/Passports.jsx'
import Orders from './pages/Orders.jsx'
import Home from './pages/Home.jsx' // Створи з твоєї головної сторінки

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/instruments" element={<Instruments />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/services" element={<Services />} />
      <Route path="/passports" element={<Passports />} />
      <Route path="/orders" element={<Orders />} /> 
    </Routes>
  )
}
export default AppRoutes
