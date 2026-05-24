import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import orderService from '../../services/orderService'
import { formatCurrency, Spinner, EmptyState, OrderStatusBadge, PageHeader, Pagination } from '../../components/common'

export default function OrdersPage() {
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)
  const [page,    setPage]    = useState(1)
  const [meta,    setMeta]    = useState(null)

  useEffect(() => {
    setLoading(true)
    orderService.getOrders(page)
      .then(({ data }) => {
        setOrders(data.data ?? [])
        setMeta(data) // Since data itself is the paginator from Laravel
      })
      .finally(() => setLoading(false))
  }, [page])

  if (loading) return (
    <div className="page-container">
      <div className="mb-8">
        <div className="skeleton-text w-48 h-8 mb-2" />
        <div className="skeleton-text w-32 h-4" />
      </div>
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-zinc-100/80 p-4 flex items-center justify-between animate-fade-up" style={{ animationDelay: `${i * 75}ms` }}>
            <div className="space-y-2 flex-1">
              <div className="skeleton-text w-40 h-5" />
              <div className="skeleton-text w-56 h-3" />
            </div>
            <div className="skeleton-text w-24 h-5" />
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="page-container">
      <PageHeader title="Riwayat Pesanan" subtitle="Semua pesanan kamu" />

      {orders.length === 0 ? (
        <EmptyState
          icon={<svg className="w-12 h-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
          title="Belum ada pesanan"
          description="Kamu belum pernah melakukan pesanan."
          action={<Link to="/" className="btn-primary">Pesan Sekarang</Link>}
        />
      ) : (
        <div className="space-y-3">
          {orders.map((order, idx) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="card-hover p-4 sm:p-5 flex items-center justify-between gap-4 block animate-fade-up"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-display font-bold text-sm text-zinc-800">
                    Pesanan #{order.id}
                  </span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <span className="text-xs text-zinc-400 flex items-center gap-1.5">
                  <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  {order.floor?.name} · {new Date(order.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="font-display font-bold text-emerald-600 text-sm">
                  {formatCurrency(order.total_price)}
                </span>
                <div className="w-6 h-6 rounded-lg bg-zinc-50 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && orders.length > 0 && (
        <Pagination meta={meta} onPageChange={setPage} />
      )}
    </div>
  )
}
