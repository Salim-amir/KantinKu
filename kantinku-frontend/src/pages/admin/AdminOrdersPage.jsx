import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import orderService from '../../services/orderService'
import { formatCurrency, Spinner, EmptyState, OrderStatusBadge, Alert, PageHeader, Pagination } from '../../components/common'

const STATUSES = ['', 'pending', 'paid', 'preparing', 'ready_for_pickup', 'completed']
const STATUS_LABELS = {
  '': 'Semua', pending: 'Menunggu', paid: 'Lunas',
  preparing: 'Disiapkan', ready_for_pickup: 'Siap Ambil', completed: 'Selesai',
}
const NEXT_STATUS = {
  pending: 'paid', paid: 'preparing',
  preparing: 'ready_for_pickup', ready_for_pickup: 'completed',
}
const NEXT_LABEL = {
  pending: 'Konfirmasi Bayar', paid: 'Mulai Siapkan',
  preparing: 'Tandai Siap', ready_for_pickup: 'Selesaikan',
}

export default function AdminOrdersPage() {
  const [orders,     setOrders]     = useState([])
  const [filter,     setFilter]     = useState('')
  const [loading,    setLoading]    = useState(true)
  const [updating,   setUpdating]   = useState(null)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg,   setErrorMsg]   = useState('')
  const [page,       setPage]       = useState(1)
  const [meta,       setMeta]       = useState(null)
  const [confirmModal, setConfirmModal] = useState(null) // { orderId, newStatus }

  const loadOrders = (status = filter, pageNum = page) => {
    setLoading(true)
    orderService.adminGetOrders(status, pageNum)
      .then(({ data }) => {
        setOrders(data.data ?? [])
        setMeta(data)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadOrders(filter, page) }, [filter, page])

  const handleFilterChange = (newStatus) => {
    setFilter(newStatus)
    setPage(1)
  }

  const handleStatusUpdate = async () => {
    if (!confirmModal) return
    const { orderId, newStatus } = confirmModal
    setConfirmModal(null)
    setUpdating(orderId)
    setSuccessMsg('')
    setErrorMsg('')
    try {
      await orderService.adminUpdateStatus(orderId, newStatus)
      setSuccessMsg(`Status pesanan #${orderId} berhasil diperbarui.`)
      loadOrders()
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      setErrorMsg(err.response?.data?.message ?? 'Gagal update status.')
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="page-container">
      <PageHeader title="Kelola Pesanan" subtitle="Update status pesanan mahasiswa" />

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {STATUSES.map((s) => (
          <button key={s}
                  onClick={() => handleFilterChange(s)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300
                              ${filter === s
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm shadow-emerald-200'
                                : 'bg-white border border-zinc-200/80 text-zinc-500 hover:border-emerald-200 hover:text-emerald-600 hover:bg-emerald-50/50'
                              }`}>
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {successMsg && <div className="mb-4"><Alert type="success" message={successMsg} /></div>}
      {errorMsg   && <div className="mb-4"><Alert type="error"   message={errorMsg}   /></div>}

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-zinc-100/80 p-5 animate-fade-up" style={{ animationDelay: `${i * 75}ms` }}>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="skeleton-text w-48 h-5" />
                  <div className="skeleton-text w-32 h-3" />
                  <div className="skeleton-text w-24 h-3" />
                </div>
                <div className="skeleton-text w-28 h-8 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState 
          icon={<svg className="w-12 h-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>} 
          title="Tidak ada pesanan" description="Belum ada pesanan dengan filter ini." />
      ) : (
        <div className="space-y-3">
          {orders.map((order, idx) => (
            <div key={order.id}
              className="card p-4 sm:p-5 hover:shadow-lift transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="font-display font-bold text-zinc-800">Pesanan #{order.id}</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="text-sm text-zinc-500 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    {order.user?.name} · {order.floor?.name}
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    {new Date(order.created_at).toLocaleString('id-ID')}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-display font-bold text-emerald-600">
                    {formatCurrency(order.total_price)}
                  </span>
                  {order.payment_proof_url && (
                    <a href={order.payment_proof_url} target="_blank" rel="noreferrer"
                       className="text-xs text-blue-600 hover:text-blue-700 font-semibold px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                      Lihat Bukti
                    </a>
                  )}
                  {NEXT_STATUS[order.status] && (
                    <button
                      onClick={() => setConfirmModal({ orderId: order.id, newStatus: NEXT_STATUS[order.status], currentStatus: order.status })}
                      disabled={updating === order.id || (order.status === 'pending' && !order.payment_proof_url)}
                      className={`text-xs px-3.5 py-2 ${
                        order.status === 'pending' && !order.payment_proof_url 
                          ? 'btn-disabled bg-zinc-100 text-zinc-400 cursor-not-allowed rounded-xl font-semibold' 
                          : 'btn-primary'
                      }`}
                      title={order.status === 'pending' && !order.payment_proof_url ? "Mahasiswa belum mengupload bukti" : ""}
                    >
                      {updating === order.id ? (
                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : NEXT_LABEL[order.status]}
                    </button>
                  )}
                </div>
              </div>

              {/* Order items preview */}
              {order.order_items?.length > 0 && (
                <div className="mt-3.5 pt-3.5 border-t border-zinc-50 flex flex-wrap gap-2">
                  {order.order_items.map((item) => (
                    <span key={item.id}
                          className="text-xs bg-zinc-50 text-zinc-500 px-2.5 py-1 rounded-lg font-medium border border-zinc-100/50">
                      {item.product?.name} ×{item.quantity}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && orders.length > 0 && (
        <Pagination meta={meta} onPageChange={setPage} />
      )}

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-lift w-full max-w-sm p-6 sm:p-7 animate-scale-in text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            </div>
            <h3 className="font-display font-bold text-xl text-zinc-800 mb-2">Update Status?</h3>
            <p className="text-zinc-500 text-sm mb-8">
              Apakah Anda yakin ingin mengubah status pesanan ini menjadi <span className="font-bold text-zinc-700">{STATUS_LABELS[confirmModal.newStatus]}</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal(null)}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 transition-colors duration-200"
              >
                Batal
              </button>
              <button
                onClick={handleStatusUpdate}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200"
              >
                Ya, Ubah
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
