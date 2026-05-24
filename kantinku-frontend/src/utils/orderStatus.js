export const STATUS_CONFIG = {
  pending: {
    label: 'Menunggu Pembayaran',
    color: 'bg-yellow-100 text-yellow-700',
    dot:   'bg-yellow-400',
  },
  paid: {
    label: 'Pembayaran Dikonfirmasi',
    color: 'bg-blue-100 text-blue-700',
    dot:   'bg-blue-400',
  },
  preparing: {
    label: 'Sedang Disiapkan',
    color: 'bg-purple-100 text-purple-700',
    dot:   'bg-purple-400',
  },
  ready_for_pickup: {
    label: 'Siap Diambil',
    color: 'bg-green-100 text-green-700',
    dot:   'bg-green-400',
  },
  completed: {
    label: 'Selesai',
    color: 'bg-zinc-100 text-zinc-600',
    dot:   'bg-zinc-400',
  },
}

export function getStatusConfig(status) {
  return STATUS_CONFIG[status] ?? { label: status, color: 'bg-zinc-100 text-zinc-600', dot: 'bg-zinc-400' }
}
