import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import cartService from '../../services/cartService'
import orderService from '../../services/orderService'
import { useCart } from '../../context/CartContext'

export default function CartPage() {
  const { fetchCart } = useCart()
  const navigate      = useNavigate()

  const [items,    setItems]    = useState([])
  const [total,    setTotal]    = useState(0)
  const [note,     setNote]     = useState('')
  const [loading,  setLoading]  = useState(true)
  const [checking, setChecking] = useState(false)
  const [error,    setError]    = useState('')

  const loadCart = async () => {
    setLoading(true)
    try {
      const { data } = await cartService.getCart()
      setItems(data.data ?? [])
      setTotal(data.total ?? 0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadCart() }, [])

  const handleRemove = async (id) => {
    await cartService.removeItem(id)
    await loadCart()
    await fetchCart()
  }

  const handleUpdateQty = async (id, qty) => {
    if (qty < 1) return
    try {
      await cartService.updateItem(id, { quantity: qty })
      await loadCart()
      await fetchCart()
    } catch (err) {
      setError(err.response?.data?.message ?? 'Gagal update.')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleCheckout = async () => {
    if (items.length === 0) return

    // Ambil floor_id dari item pertama di keranjang
    // (semua item diasumsikan dari lantai yang sama)
    const floorId = items[0]?.floor?.id
    if (!floorId) {
      setError('Data lantai tidak ditemukan.')
      return
    }

    setChecking(true)
    setError('')
    try {
      const { data } = await orderService.checkout({
        floor_id: floorId,
        note,
      })
      await fetchCart()
      navigate(`/orders/${data.data.id}`)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Checkout gagal.')
    } finally {
      setChecking(false)
    }
  }

  if (loading) return (
    <div className="page-container">
      {/* Skeleton loading */}
      <div className="mb-8">
        <div className="skeleton-text w-40 h-8 mb-2" />
        <div className="skeleton-text w-24 h-4" />
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-zinc-100/80 p-4 flex gap-4 items-center animate-fade-up" style={{ animationDelay: `${i * 75}ms` }}>
              <div className="skeleton-card w-16 h-16 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="skeleton-text w-2/3" />
                <div className="skeleton-text w-1/3 h-3" />
                <div className="skeleton-text w-1/4 h-5" />
              </div>
            </div>
          ))}
        </div>
        <div className="skeleton-card h-80 rounded-2xl" />
      </div>
    </div>
  )

  return (
    <div className="page-container">
      <div className="mb-8 animate-fade-up">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-zinc-800">Keranjang</h1>
        <p className="text-zinc-500 text-sm mt-1">{items.length} item di keranjang</p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center animate-fade-up">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-zinc-50 to-zinc-100 border border-zinc-200/50 flex items-center justify-center mb-5 shadow-soft">
            <svg className="w-10 h-10 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="font-display font-bold text-zinc-800 text-lg mb-1.5">Keranjang kosong</p>
          <p className="text-zinc-500 text-sm mb-5">Tambahkan produk dari menu kantin.</p>
          <Link to="/" className="btn-primary">Lihat Menu</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Item list */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item, idx) => (
              <div key={item.id}
                className="bg-white rounded-2xl border border-zinc-100/80 shadow-soft p-4 flex gap-4 items-center
                           hover:shadow-lift transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Gambar */}
                <div className="w-16 h-16 rounded-xl bg-zinc-50 flex items-center justify-center flex-shrink-0 text-3xl overflow-hidden border border-zinc-100/50">
                  {item.product?.image_url
                    ? <img src={item.product.image_url} className="w-full h-full object-cover" alt="" />
                    : <svg className="w-6 h-6 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-zinc-800 truncate">{item.product?.name}</p>
                  <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {item.floor?.name}
                  </p>
                  <p className="text-emerald-600 font-display font-bold text-sm mt-1">
                    Rp {Number(item.subtotal).toLocaleString('id-ID')}
                  </p>
                </div>

                {/* Qty controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/50 flex items-center justify-center font-bold text-zinc-500 transition-all duration-200 text-sm hover:text-zinc-700"
                  >−</button>
                  <span className="w-8 text-center text-sm font-display font-bold text-zinc-800">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/50 flex items-center justify-center font-bold text-zinc-500 transition-all duration-200 text-sm hover:text-zinc-700"
                  >+</button>
                </div>

                {/* Hapus */}
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-zinc-300 hover:text-red-400 transition-colors duration-200 p-1.5 rounded-lg hover:bg-red-50 ml-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Checkout panel */}
          <div className="animate-fade-up delay-200">
            <div className="bg-white rounded-2xl border border-zinc-100/80 shadow-soft p-5 sm:p-6 sticky top-24">
              <h3 className="font-display font-bold text-zinc-800 text-lg mb-5">Ringkasan Pesanan</h3>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Total Item</span>
                  <span className="font-semibold text-zinc-800">{items.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Lokasi Pengambilan</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {items[0]?.floor?.name ?? '-'}
                  </span>
                </div>
                <div className="h-px bg-zinc-100 my-3" />
                <div className="flex justify-between items-baseline">
                  <span className="font-display font-bold text-zinc-800">Total Harga</span>
                  <span className="font-display font-bold text-emerald-600 text-xl">
                    Rp {Number(total).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Info pickup */}
              <div className="bg-emerald-50 border border-emerald-100/60 rounded-xl p-3.5 mb-5">
                <p className="text-xs text-emerald-700 font-medium flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  Ambil pesanan di <strong>{items[0]?.floor?.name}</strong>
                </p>
                <p className="text-xs text-emerald-600/80 mt-1 ml-5">
                  Setelah pesanan siap, kamu akan diberitahu untuk mengambil di lantai ini.
                </p>
              </div>

              {/* Catatan */}
              <div className="mb-5">
                <label className="label">Catatan (opsional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Contoh: jangan pakai es"
                  rows={2}
                  className="input resize-none"
                />
              </div>

              {error && (
                <div className="mb-4 px-3.5 py-2.5 bg-red-50 border border-red-200/60 text-red-700 text-xs rounded-xl flex items-center gap-2 animate-fade-up font-medium">
                  <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-[10px] font-bold flex-shrink-0">✕</span>
                  {error}
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={checking}
                className="btn-primary w-full py-3"
              >
                {checking ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Memproses...
                  </span>
                ) : 'Buat Pesanan'}
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}