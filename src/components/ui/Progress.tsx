/** Thanh tiến độ dùng chung. `value` từ 0 đến 100. */
export function ProgressBar({
  value,
  tone = 'accent',
  height = 'h-2.5',
  label,
}: {
  value: number
  tone?: 'accent' | 'success' | 'info' | 'warning'
  height?: string
  label?: string
}) {
  const v = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0))
  const color = { accent: 'bg-indigo-500', success: 'bg-emerald-500', info: 'bg-sky-500', warning: 'bg-amber-400' }[tone]
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(v)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={`w-full overflow-hidden rounded-full bg-slate-100 ${height}`}
    >
      <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${v}%` }} />
    </div>
  )
}
