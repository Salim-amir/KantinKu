import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

import ProtectedRoute from './routes/ProtectedRoute'
import GuestRoute     from './routes/GuestRoute'
import Navbar         from './components/common/Navbar'

import LoginPage       from './pages/auth/LoginPage'
import RegisterPage    from './pages/auth/RegisterPage'
import ProfilePage     from './pages/auth/ProfilePage'
import HomePage        from './pages/student/HomePage'
import CartPage        from './pages/student/CartPage'
import OrdersPage      from './pages/student/OrdersPage'
import OrderDetailPage from './pages/student/OrderDetailPage'
import AdminDashboard    from './pages/admin/AdminDashboard'
import AdminOrdersPage   from './pages/admin/AdminOrdersPage'
import AdminProductsPage from './pages/admin/AdminProductsPage'
import AdminStockPage    from './pages/admin/AdminStockPage'
import AdminFloorsPage   from './pages/admin/AdminFloorsPage'

// Navbar hanya tampil di luar halaman auth
function Layout() {
  const location = useLocation()
  const hideNavbar = ['/login', '/register'].includes(location.pathname)

  return (
    <div className="min-h-screen bg-zinc-50">
      {!hideNavbar && <Navbar />}
      <main className="animate-fade-in">
        <Routes>
          <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
          <Route path="/profile"  element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          <Route path="/"          element={<ProtectedRoute role="student"><HomePage /></ProtectedRoute>} />
          <Route path="/cart"      element={<ProtectedRoute role="student"><CartPage /></ProtectedRoute>} />
          <Route path="/orders"    element={<ProtectedRoute role="student"><OrdersPage /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute role="student"><OrderDetailPage /></ProtectedRoute>} />

          <Route path="/admin"          element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/floors"   element={<ProtectedRoute role="admin"><AdminFloorsPage /></ProtectedRoute>} />
          <Route path="/admin/orders"   element={<ProtectedRoute role="admin"><AdminOrdersPage /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute role="admin"><AdminProductsPage /></ProtectedRoute>} />
          <Route path="/admin/stock"    element={<ProtectedRoute role="admin"><AdminStockPage /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Layout />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}