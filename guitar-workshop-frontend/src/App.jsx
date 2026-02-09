import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Instruments from './pages/Instruments.jsx'
import Customers from './pages/Customers.jsx'
import Services from './pages/Services.jsx'
import Passports from './pages/Passports.jsx'
import './index.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Навігація */}
        <nav className="bg-white shadow-lg border-b">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="text-2xl font-bold text-gray-800">
                  🎸 Гітарна майстерня
                </Link>
              </div>
              <div className="flex space-x-4 items-center">
                <Link 
                  to="/instruments" 
                  className="px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Інструменти
                </Link>
                <Link 
                  to="/customers" 
                  className="px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Клієнти
                </Link>
                <Link 
                  to="/services" 
                  className="px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Послуги
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Основний контент */}
        <main className="max-w-7xl mx-auto py-8 px-4">
          <Routes>
            <Route path="/instruments" element={<Instruments />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/services" element={<Services />} /> {/* ➕ */}
            <Route path="/passports" element={<Passports />} />
            <Route path="/" element={
              <div className="text-center py-20">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                  Ласкаво просимо до гітарної майстерні!
                </h1>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link 
                    to="/instruments" 
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all font-medium"
                  >
                    Переглянути інструменти
                  </Link>
                  <Link 
                    to="/customers" 
                    className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-all font-medium"
                  >
                    Клієнти
                  </Link>
                  <Link 
                    to="/services" 
                    className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-all font-medium"
                  >
                    Послуги
                  </Link>
                  <Link to="/passports" className="px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                    Паспорти
                  </Link>
                </div>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
