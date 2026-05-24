import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import orderService from '../../services/orderService'
import adminService from '../../services/adminService'
import { formatCurrency, Spinner, OrderStatusBadge, PageHeader } from '../../components/common'

export default function AdminDashboard() {
  const [orders,   setOrders]   = useState([])
  const [stock,    setStock]    = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    Promise.all([
      orderService.adminGetOrders(),
      adminService.getStock(),
    ]).then(([ordersRes, stockRes]) => {
      setOrders(ordersRes.data.data ?? [])
      setStock(stockRes.data.data ?? [])
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="page-container">
      <div className="mb-8">
        <div className="skeleton-text w-56 h-8 mb-2" />
        <div className="skeleton-text w-40 h-4" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton-card h-28 rounded-2xl" />
        ))}
      </div>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="skeleton-card h-24 rounded-2xl" />
        ))}
      </div>
      <div className="skeleton-card h-72 rounded-2xl" />
    </div>
  )

  const pending  = orders.filter(o => o.status === 'pending').length
  const paid     = orders.filter(o => o.status === 'paid').length
  const active   = orders.filter(o => !['completed'].includes(o.status)).length
  const revenue  = orders.filter(o => o.status === 'completed')
                         .reduce((s, o) => s + parseFloat(o.total_price), 0)

  const stats = [
    { label: 'Pesanan Aktif',    value: active,              icon: <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>, gradient: 'from-blue-500 to-indigo-500',   bg: 'bg-blue-50'   },
    { label: 'Menunggu Bayar',   value: pending,             icon: <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, gradient: 'from-amber-500 to-orange-500',  bg: 'bg-amber-50'  },
    { label: 'Perlu Konfirmasi', value: paid,                icon: <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, gradient: 'from-purple-500 to-pink-500',   bg: 'bg-purple-50' },
    { label: 'Total Revenue',    value: formatCurrency(revenue), icon: <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, gradient: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50'},
  ]

  return (
    <div className="page-container">
      <PageHeader
        title="Dashboard Admin"
        subtitle="Selamat datang kembali 👋"
        action={
          <Link to="/admin/orders" className="btn-primary text-sm">
            Lihat Semua Pesanan
          </Link>
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="card p-5 animate-fade-up hover:shadow-lift transition-all duration-300"
               style={{ animationDelay: `${i * 75}ms` }}>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-3 shadow-sm`}>
              <div className="flex items-center justify-center">{s.icon}</div>
            </div>
            <p className="text-2xl font-display font-bold text-zinc-800">{s.value}</p>
            <p className="text-xs text-zinc-400 mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { to: '/admin/floors',   label: 'Kelola Lantai',  icon: <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>, desc: 'Tambah, edit lantai & QRIS', gradient: 'from-fuchsia-500 to-pink-500' },
          { to: '/admin/products', label: 'Kelola Produk',  icon: <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>, desc: 'Tambah, edit, hapus produk', gradient: 'from-amber-500 to-orange-500' },
          { to: '/admin/stock',    label: 'Kelola Stok',    icon: <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>, desc: 'Atur stok per lantai',       gradient: 'from-blue-500 to-indigo-500'  },
          { to: '/admin/orders',   label: 'Kelola Pesanan', icon: <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>, desc: 'Update status pesanan',      gradient: 'from-emerald-500 to-teal-500' },
        ].map((l, i) => (
          <Link key={l.to} to={l.to}
                className="card-hover p-5 flex items-center gap-4 animate-fade-up"
                style={{ animationDelay: `${(i + 4) * 75}ms` }}>
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${l.gradient} flex items-center justify-center shadow-sm flex-shrink-0`}>
              <div className="flex items-center justify-center">{l.icon}</div>
            </div>
            <div>
              <p className="font-display font-semibold text-zinc-800">{l.label}</p>
              <p className="text-xs text-zinc-400 mt-0.5">{l.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="card overflow-hidden animate-fade-up delay-500">
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-zinc-100/50">
          <h3 className="font-display font-bold text-zinc-800">Pesanan Terbaru</h3>
          <Link to="/admin/orders" className="text-xs text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
            Lihat semua →
          </Link>
        </div>
        {orders.length === 0 ? (
          <div className="p-8 text-center text-sm text-zinc-400">Belum ada pesanan.</div>
        ) : (
          <div className="divide-y divide-zinc-50">
            {orders.slice(0, 8).map((order) => (
              <Link key={order.id} to={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between px-5 sm:px-6 py-4 hover:bg-zinc-50/50 transition-colors duration-200">
                <div>
                  <p className="text-sm font-display font-semibold text-zinc-800">
                    #{order.id} · {order.user?.name}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {order.floor?.name}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <OrderStatusBadge status={order.status} />
                  <span className="text-sm font-display font-bold text-zinc-800 hidden sm:block">
                    {formatCurrency(order.total_price)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
