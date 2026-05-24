import { useEffect, useState } from 'react'
import adminService from '../../services/adminService'
import productService from '../../services/productService'

export default function AdminStockPage() {
  const [floors,     setFloors]     = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [saving,     setSaving]     = useState(null)
  const [success,    setSuccess]    = useState('')
  const [error,      setError]      = useState('')
  const [stockEdits, setStockEdits] = useState({})

  // Form assign produk baru ke lantai
  const [assignFloor,   setAssignFloor]   = useState('')
  const [assignProduct, setAssignProduct] = useState('')
  const [assignStock,   setAssignStock]   = useState(0)
  const [assigning,     setAssigning]     = useState(false)

  const loadData = () => {
    setLoading(true)
    Promise.all([adminService.getStock(), adminService.getProducts()])
      .then(([stockRes, productRes]) => {
        const floorData = stockRes.data.data ?? []
        setFloors(floorData)
        setAllProducts(productRes.data.data ?? [])
        const edits = {}
        floorData.forEach(floor => {
          floor.products?.forEach(p => {
            edits[`${floor.id}-${p.id}`] = p.pivot.stock
          })
        })
        setStockEdits(edits)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadData() }, [])

  const handleSave = async (floorId, productId) => {
    const key   = `${floorId}-${productId}`
    const stock = parseInt(stockEdits[key], 10)
    if (isNaN(stock) || stock < 0) return
    setSaving(key)
    try {
      await adminService.updateStock(floorId, productId, stock)
      setSuccess('Stok berhasil diperbarui.')
      setTimeout(() => setSuccess(''), 2000)
    } catch {
      setError('Gagal update stok.')
      setTimeout(() => setError(''), 2000)
    } finally {
      setSaving(null)
    }
  }

  const handleAssign = async (e) => {
    e.preventDefault()
    if (!assignFloor || !assignProduct) return
    setAssigning(true)
    setError('')
    try {
      await adminService.setStock({
        floor_id:   parseInt(assignFloor),
        product_id: parseInt(assignProduct),
        stock:      parseInt(assignStock) || 0,
      })
      setSuccess('Produk berhasil ditambahkan ke lantai!')
      setAssignFloor('')
      setAssignProduct('')
      setAssignStock(0)
      loadData()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Gagal assign produk.')
    } finally {
      setAssigning(false)
    }
  }

  if (loading) return (
    <div className="page-container">
      <div className="mb-8">
        <div className="skeleton-text w-40 h-8 mb-2" />
        <div className="skeleton-text w-56 h-4" />
      </div>
      <div className="skeleton-card h-36 rounded-2xl mb-6" />
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="skeleton-card h-48 rounded-2xl" />
        ))}
      </div>
    </div>
  )

  return (
    <div className="page-container">
      <div className="mb-8 animate-fade-up">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-zinc-800">Kelola Stok</h1>
        <p className="text-zinc-500 text-sm mt-1.5">Atur ketersediaan produk per lantai</p>
      </div>

      {/* Feedback */}
      {success && (
        <div className="mb-5 px-4 py-3.5 bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-sm rounded-xl flex items-center gap-3 animate-fade-up font-medium">
          <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold flex-shrink-0">✓</span>
          {success}
        </div>
      )}
      {error && (
        <div className="mb-5 px-4 py-3.5 bg-red-50 border border-red-200/60 text-red-700 text-sm rounded-xl flex items-center gap-3 animate-fade-up font-medium">
          <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-xs font-bold flex-shrink-0">✕</span>
          {error}
        </div>
      )}

      {/* ── Assign produk ke lantai ───────────────────────────────── */}
      <div className="card p-5 sm:p-6 mb-6 animate-fade-up">
        <h3 className="font-display font-bold text-zinc-800 mb-5 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm">
            <span className="text-white text-sm">+</span>
          </div>
          Tambah Produk ke Lantai
        </h3>
        <form onSubmit={handleAssign} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          {/* Pilih lantai */}
          <div>
            <label className="label">Lantai</label>
            <select
              value={assignFloor}
              onChange={(e) => setAssignFloor(e.target.value)}
              required
              className="input"
            >
              <option value="">-- Pilih Lantai --</option>
              {floors.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          {/* Pilih produk */}
          <div>
            <label className="label">Produk</label>
            <select
              value={assignProduct}
              onChange={(e) => setAssignProduct(e.target.value)}
              required
              className="input"
            >
              <option value="">-- Pilih Produk --</option>
              {allProducts.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Stok awal */}
          <div>
            <label className="label">Stok Awal</label>
            <input
              type="number"
              min="0"
              value={assignStock}
              onChange={(e) => setAssignStock(e.target.value)}
              className="input"
            />
          </div>

          <button
            type="submit"
            disabled={assigning}
            className="btn-primary w-full py-2.5"
          >
            {assigning ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Menyimpan...
              </span>
            ) : 'Tambahkan'}
          </button>
        </form>
      </div>

      {/* ── Daftar stok per lantai ────────────────────────────────── */}
      <div className="space-y-4">
        {floors.map((floor, floorIdx) => (
          <div key={floor.id}
            className="card overflow-hidden animate-fade-up"
            style={{ animationDelay: `${(floorIdx + 1) * 100}ms` }}
          >
            {/* Floor header */}
            <div className="px-5 sm:px-6 py-4 bg-zinc-50/80 border-b border-zinc-100/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-sm text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1v1H9V7zm5 0h1v1h-1V7zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1zm-3-4h2a2 2 0 012 2v14H7V9a2 2 0 012-2h2z" /></svg>
              </div>
              <div>
                <h3 className="font-display font-bold text-zinc-800">{floor.name}</h3>
                {floor.description && <p className="text-xs text-zinc-400">{floor.description}</p>}
              </div>
              <span className="ml-auto text-xs text-zinc-400 bg-zinc-100 px-2.5 py-1 rounded-full font-semibold border border-zinc-200/50">
                {floor.products?.length ?? 0} produk
              </span>
            </div>

            {floor.products?.length === 0 ? (
              <p className="px-5 sm:px-6 py-8 text-sm text-zinc-400 text-center">
                Belum ada produk di lantai ini. Tambahkan di atas.
              </p>
            ) : (
              <div className="divide-y divide-zinc-50">
                {floor.products.map((product) => {
                  const key   = `${floor.id}-${product.id}`
                  const stock = stockEdits[key] ?? product.pivot.stock
                  return (
                    <div key={product.id} className="flex items-center justify-between px-5 sm:px-6 py-4 gap-4 hover:bg-zinc-50/30 transition-colors duration-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100/50 flex items-center justify-center text-zinc-300 flex-shrink-0 overflow-hidden">
                          {product.image_url
                            ? <img src={product.image_url} className="w-full h-full object-contain p-1 rounded-xl" alt="" />
                            : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-zinc-800">{product.name}</p>
                          <p className="text-xs text-zinc-400 capitalize">{product.category}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 flex-shrink-0">
                        {/* Stock color indicator */}
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border
                          ${stock === 0 ? 'bg-red-50 text-red-600 border-red-100'
                            : stock <= 3 ? 'bg-amber-50 text-amber-600 border-amber-100'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                          {stock === 0 ? 'Habis' : stock <= 3 ? 'Hampir habis' : 'Tersedia'}
                        </span>
                        <input
                          type="number"
                          min="0"
                          value={stock}
                          onChange={(e) => setStockEdits(prev => ({ ...prev, [key]: e.target.value }))}
                          className="input w-20 text-center text-sm font-semibold py-2"
                        />
                        <button
                          onClick={() => handleSave(floor.id, product.id)}
                          disabled={saving === key}
                          className="btn-primary text-xs px-4 py-2"
                        >
                          {saving === key ? (
                            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                          ) : 'Simpan'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}