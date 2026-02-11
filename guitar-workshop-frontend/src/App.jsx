import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Instruments from './pages/Instruments.jsx'
import Customers from './pages/Customers.jsx'
import Services from './pages/Services.jsx'
import Passports from './pages/Passports.jsx'
import Orders from './pages/Orders.jsx'

import './index.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
        {/* 🔥 КОМПАКТНА НАВІГАЦІЯ */}
        <nav className="bg-white/90 backdrop-blur-md shadow-lg border-b border-emerald-100 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center h-14">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl shadow-lg flex items-center justify-center group-hover:scale-105 transition-all">
                  <span className="text-2xl">🎸</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-emerald-600 bg-clip-text text-transparent">
                  Гітарна майстерня
                </span>
              </Link>
              
              <div className="hidden md:flex items-center space-x-1">
                {[
                  { to: '/instruments', label: 'Інструменти', icon: '🎸' },
                  { to: '/customers', label: 'Клієнти', icon: '👥' },
                  { to: '/services', label: 'Послуги', icon: '🛠️' },
                  { to: '/passports', label: 'Паспорти', icon: '📋' },
                  { to: '/orders', label: 'Замовлення', icon: '📦' },

                ].map(({ to, label, icon }) => (
                  <Link 
                    key={to}
                    to={to} 
                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-all flex items-center space-x-1"
                  >
                    <span>{icon}</span><span>{label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* 🔥 СУПЕР-КОМПАКТНИЙ КОНТЕНТ */}
        <main className="max-w-6xl mx-auto px-4 pb-8 pt-4">
          <Routes>
            <Route path="/instruments" element={<Instruments />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/services" element={<Services />} />
            <Route path="/passports" element={<Passports />} />
            <Route path="/orders" element={<Orders />} />

            <Route path="/" element={
              <div className="text-center space-y-8 max-h-screen flex flex-col justify-center items-center py-8">
                {/* 🎨 ЛОГО + НАЗВА */}
                <div className="space-y-4">
                  <div className="w-24 h-24 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 rounded-2xl mx-auto shadow-2xl flex items-center justify-center">
                    <span className="text-4xl">🎸</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-gray-900 via-emerald-700 to-blue-600 bg-clip-text text-transparent leading-tight">
                    Гітарна<br className="sm:hidden"/> майстерня
                  </h1>
                  <p className="text-lg md:text-xl text-gray-600 max-w-md mx-auto leading-relaxed">
                    Професійний ремонт гітар. Швидко. Якісно. Надійно.
                  </p>
                </div>

                {/* 🔥 4 КОМПАКТНІ КАРТКИ */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl">
                  {[
                    { to: '/instruments', icon: '🎸', title: 'Інструменти', desc: 'Управління гітарним парком' },
                    { to: '/customers', icon: '👥', title: 'Клієнти', desc: 'База постійних клієнтів' },
                    { to: '/services', icon: '🛠️', title: 'Послуги', desc: 'Каталог ремонтних робіт' },
                    { to: '/passports', icon: '📋', title: 'Паспорти', desc: 'Технічна документація' },
                    { to: '/orders', icon: '📦', title: 'Замовлення', desc: 'Ремонтні замовлення' }

                  ].map(({ to, icon, title, desc }) => (
                    <Link 
                      to={to}
                      key={to}
                      className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-white/50 hover:border-emerald-200 flex flex-col items-center text-center h-32 hover:h-36"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center mb-3 shadow-xl group-hover:scale-110 transition-all">
                        <span className="text-2xl">{icon}</span>
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-emerald-700">{title}</h3>
                      <p className="text-xs text-gray-500 leading-tight">{desc}</p>
                    </Link>
                  ))}
                </div>

                {/* 🔥 КОМПАКТНИЙ CTA */}
                <Link 
                  to="/instruments"
                  className="group bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center space-x-3 mx-auto"
                >
                  <span>🎸 Почати роботу</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
