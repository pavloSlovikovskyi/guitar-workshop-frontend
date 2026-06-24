import { useSelector } from 'react-redux'
import Layout from './Layout.jsx'
import AppRoutes from './AppRoutes.jsx'

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  if (!isAuthenticated) {
    return <AppRoutes />
  }

  return (
    <Layout>
      <AppRoutes />
    </Layout>
  )
}

export default App
