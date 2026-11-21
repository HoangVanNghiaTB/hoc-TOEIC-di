import { toggleFlag, useStore } from '../lib/store'

/** Nút “Báo sai”: đánh dấu mục nghi sai để gom lại ở Cài đặt. */
export default function FlagButton({ id, className = '' }: { id: string; className?: string }) {
  const s = useStore()
  const on = !!s.flags[id]
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        toggleFlag(id)
      }}
      className={`rounded-full px-3 py-1 text-xs ${on ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'} ${className}`}
    >
      {on ? '🚩 Đã báo sai' : '🏳️ Báo sai'}
    </button>
  )
}
