import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="text-center space-y-12 max-h-screen flex flex-col justify-center items-center py-12 bg-white text-black">
      <div className="space-y-4">
        <div className="w-24 h-24 border-2 border-black mx-auto flex items-center justify-center">
          <span className="text-4xl">🎸</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-tight">
          Гітарна<br className="sm:hidden"/> майстерня
        </h1>
        <p className="text-sm font-medium text-black max-w-md mx-auto leading-tight">
          Професійний ремонт гітар. Швидко. Якісно. Надійно.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 w-full max-w-5xl">
        [
          { to: '/instruments', icon: '🎸', title: 'Інструменти', desc: 'Управління гітарним парком' },
          { to: '/customers', icon: '👥', title: 'Клієнти', desc: 'База постійних клієнтів' },
          { to: '/services', icon: '🛠️', title: 'Послуги', desc: 'Каталог ремонтних робіт' },
          { to: '/passports', icon: '📋', title: 'Паспорти', desc: 'Технічна документація' },
          { to: '/orders', icon: '📦', title: 'Замовлення', desc: 'Ремонтні замовлення' }
        ].map(({ to, icon, title, desc }) => (
          <Link 
            to={to}
            key={to}
            className="bg-white border-2 border-black p-6 flex flex-col items-center text-center h-32"
          >
            <div className="w-14 h-14 border-2 border-black flex items-center justify-center mb-3">
              <span className="text-2xl">{icon}</span>
            </div>
            <h3 className="font-black uppercase text-sm mb-1">{title}</h3>
            <p className="text-xs font-medium text-black leading-tight">{desc}</p>
          </Link>
        ))}
      </div>

      <Link 
        to="/instruments"
        className="w-full max-w-xs bg-white border-2 border-black py-3 text-sm font-black uppercase hover:bg-black hover:text-white transition-all"
      >
        Почати роботу
      </Link>
    </div>
  )
}
