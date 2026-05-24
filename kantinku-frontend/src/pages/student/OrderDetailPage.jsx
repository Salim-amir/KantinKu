import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import orderService from '../../services/orderService'
import { formatCurrency, Spinner, Alert, OrderStatusBadge, Button, PageHeader } from '../../components/common'

const STATUS_FLOW = ['pending', 'paid', 'preparing', 'ready_for_pickup', 'completed']
const STATUS_LABELS = {
  pending:          'Menunggu Pembayaran',
  paid:             'Pembayaran Dikonfirmasi',
  preparing:        'Sedang Disiapkan',
  ready_for_pickup: 'Siap Diambil',
  completed:        'Selesai',
}

export default function OrderDetailPage() {
  const { id } = useParams()

  const [order,    setOrder]    = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [uploading, setUploading] = useState(false)
  const [success,  setSuccess]  = useState('')
  const [error,    setError]    = useState('')
  const fileRef = useRef()

  const loadOrder = () => {
    setLoading(true)
    orderService.getOrder(id)
      .then(({ data }) => setOrder(data.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadOrder() }, [id])

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('payment_proof', file)
    setUploading(true)
    setError('')
    try {
      await orderService.uploadPayment(id, formData)
      setSuccess('Bukti pembayaran berhasil diupload!')
      loadOrder()
    } catch (err) {
      setError(err.response?.data?.message ?? 'Upload gagal.')
    } finally {
      setUploading(false)
    }
  }

  if (loading) return (
    <div className="page-container max-w-2xl">
      <div className="mb-8">
        <div className="skeleton-text w-48 h-8 mb-2" />
        <div className="skeleton-text w-32 h-4" />
      </div>
      <div className="skeleton-card h-24 mb-5 rounded-2xl" />
      <div className="skeleton-card h-48 mb-5 rounded-2xl" />
      <div className="skeleton-card h-36 rounded-2xl" />
    </div>
  )

  if (!order) return (
    <div className="page-container">
      <Alert type="error" message="Pesanan tidak ditemukan." />
    </div>
  )

  const stepIdx = STATUS_FLOW.indexOf(order.status)

  return (
    <div className="page-container max-w-2xl">
      <PageHeader
        title="Detail Pesanan"
        subtitle={order.floor?.name}
        action={<Link to="/orders" className="btn-ghost text-sm">← Kembali</Link>}
      />

      {/* Status progress bar */}
      <div className="card p-5 sm:p-6 mb-5 animate-fade-up">
        <div className="flex items-center justify-between relative">
          {/* Track background */}
          <div className="absolute left-0 right-0 top-4 h-1 bg-zinc-100 z-0 rounded-full" />
          {/* Track progress */}
          <div
            className="absolute left-0 top-4 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 z-0 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${(stepIdx / (STATUS_FLOW.length - 1)) * 100}%` }}
          />
          {STATUS_FLOW.map((s, i) => (
            <div key={s} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-500
                               ${i <= stepIdx
                                 ? 'bg-gradient-to-br from-emerald-500 to-teal-500 border-emerald-500 text-white shadow-sm shadow-emerald-200'
                                 : 'bg-white border-zinc-200 text-zinc-400'
                               }`}>
                {i < stepIdx ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : i + 1}
              </div>
              <span className="text-[9px] sm:text-[10px] text-center text-zinc-500 hidden sm:block w-16 leading-tight font-medium">
                {STATUS_LABELS[s]}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center sm:hidden">
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      {/* Order items */}
      <div className="card p-5 sm:p-6 mb-5 animate-fade-up delay-100">
        <h3 className="font-display font-bold text-zinc-800 mb-4">Item Pesanan</h3>
        <div className="divide-y divide-zinc-50">
          {order.order_items?.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-3.5">
              <div>
                <p className="font-medium text-sm text-zinc-800">{item.product?.name}</p>
                <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  {item.floor?.name} · {item.quantity}x
                </p>
              </div>
              <span className="font-display font-semibold text-sm text-zinc-800">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-zinc-100 mt-2">
          <span className="font-display font-bold text-zinc-800">Total</span>
          <span className="font-display font-bold text-emerald-600 text-xl">{formatCurrency(order.total_price)}</span>
        </div>
      </div>

      {/* Payment section */}
      <div className="card p-5 sm:p-6 animate-fade-up delay-200">
        <h3 className="font-display font-bold text-zinc-800 mb-4">Pembayaran</h3>

        {success && <div className="mb-4"><Alert type="success" message={success} /></div>}
        {error   && <div className="mb-4"><Alert type="error"   message={error}   /></div>}

        {order.payment_proof_url ? (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-xs text-emerald-600 font-bold">✓</span>
              <p className="text-sm text-emerald-700 font-medium">Bukti pembayaran sudah diupload</p>
            </div>
            <img
              src={order.payment_proof_url}
              alt="Bukti pembayaran"
              className="w-full max-w-xs rounded-xl border border-zinc-200/50 object-cover shadow-soft"
            />
          </div>
        ) : order.status === 'pending' ? (
          <div>
            <div className="mb-6 flex flex-col items-center p-4 bg-zinc-50 border border-zinc-100 rounded-2xl">
              <p className="text-sm font-bold text-zinc-700 mb-3">Scan QRIS untuk Membayar</p>
              {order.floor?.qris_image_url ? (
                <div className="p-2 bg-white rounded-xl shadow-sm border border-zinc-100 mb-2">
                  <img src={order.floor.qris_image_url} alt="QRIS" className="w-48 h-auto object-contain" />
                </div>
              ) : (
                <div className="p-4 bg-white rounded-xl shadow-sm border border-zinc-100 mb-2 flex items-center justify-center text-center">
                  <p className="text-sm text-zinc-400">QRIS belum tersedia untuk kantin ini.</p>
                </div>
              )}
              <p className="text-xs text-zinc-500">a.n. KantinKu Official ({order.floor?.name})</p>
            </div>

            <p className="text-sm font-bold text-red-500 mb-5 leading-relaxed text-center bg-red-50 p-3 rounded-xl border border-red-100">
              WAJIB: Silakan upload bukti pembayaran agar pesanan Anda dapat diproses oleh Admin.
            </p>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="btn-primary gap-2"
            >
              {uploading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Mengupload...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                  </svg>
                  Upload Bukti Pembayaran
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <p className="text-sm text-zinc-500">Status:</p>
            <OrderStatusBadge status={order.status} />
          </div>
        )}
      </div>
    </div>
  )
}
