import { useEffect, useRef } from 'react'

/** Hộp thoại xác nhận cho hành động nguy hiểm (ví dụ xóa toàn bộ tiến độ). Esc hoặc bấm nền để hủy. */
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!open) return
    cancelRef.current?.focus()
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onCancel()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onCancel])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onCancel} role="presentation">
      <div role="alertdialog" aria-modal="true" aria-labelledby="cd-title" aria-describedby="cd-msg" onClick={(e) => e.stopPropagation()} className="pop w-full max-w-sm rounded-3xl border border-rose-500/50 bg-white p-5 shadow-lg">
        <h2 id="cd-title" className="font-display text-lg font-bold text-rose-600">⚠️ {title}</h2>
        <p id="cd-msg" className="mt-2 text-sm text-slate-600">{message}</p>
        <div className="mt-5 flex gap-3">
          <button ref={cancelRef} onClick={onCancel} className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 py-2.5 font-bold">Hủy</button>
          <button onClick={onConfirm} className="flex-1 rounded-2xl bg-rose-500 py-2.5 font-bold text-white">{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}
