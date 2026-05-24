import { useSelector } from 'react-redux'
import Layout from './Layout.jsx'
import AppRoutes from './AppRoutes.jsx'

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  // Якщо користувач не авторизований, показуємо тільки маршрути (які будуть редирект на логін)
  if (!isAuthenticated) {
    return <AppRoutes />
  }

  // Якщо авторизований, показуємо Layout з навігацією
  return (
    <Layout>
      <AppRoutes />
    </Layout>
  )
}

export default App
