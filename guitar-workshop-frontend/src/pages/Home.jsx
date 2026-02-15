import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="text-center space-y-8 max-h-screen flex flex-col justify-center items-center py-8">
      {/* ЛОГО + НАЗВА */}
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

      {/* 5 КОМПАКТНИХ КАРТОК */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 w-full max-w-5xl">
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

      {/* CTA */}
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
  )
}
