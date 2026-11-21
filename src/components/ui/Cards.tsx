import type { ReactNode } from 'react'

/** Khối nội dung chuẩn: nền bề mặt, viền 1px. */
export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-3xl bg-white p-5 shadow ${className}`}>{children}</section>
}

export function SectionHeading({ title, right, sub }: { title: ReactNode; right?: ReactNode; sub?: ReactNode }) {
  return (
    <div className="mb-3 flex items-start justify-between gap-3">
      <div>
        <h2 className="text-base font-bold tracking-wide text-slate-900 uppercase sm:text-lg">{title}</h2>
        {sub && <p className="mt-0.5 text-sm text-slate-500">{sub}</p>}
      </div>
      {right}
    </div>
  )
}

/** Thẻ số liệu: nhãn nhỏ viết hoa, số lớn, chú thích. */
export function StatCard({
  icon,
  label,
  value,
  note,
  tone = 'default',
  children,
}: {
  icon: string
  label: string
  value: ReactNode
  note?: ReactNode
  tone?: 'default' | 'accent' | 'success'
  children?: ReactNode
}) {
  const ring = tone === 'accent' ? 'ring-1 ring-indigo-500/40' : tone === 'success' ? 'ring-1 ring-emerald-500/40' : ''
  return (
    <div className={`rounded-3xl bg-white p-4 shadow ${ring}`}>
      <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
        <span aria-hidden className="text-base">{icon}</span>
        {label}
      </div>
      <div className="font-display mt-1.5 text-3xl font-bold text-slate-900">{value}</div>
      {note && <div className="mt-0.5 text-xs text-slate-500">{note}</div>}
      {children && <div className="mt-2.5">{children}</div>}
    </div>
  )
}

type Tone = 'success' | 'danger' | 'warning' | 'info' | 'accent' | 'muted'
const TONES: Record<Tone, string> = {
  success: 'bg-emerald-100 text-emerald-700',
  danger: 'bg-rose-100 text-rose-700',
  warning: 'bg-amber-100 text-amber-700',
  info: 'bg-sky-100 text-sky-700',
  accent: 'bg-indigo-100 text-indigo-700',
  muted: 'bg-slate-100 text-slate-500',
}

/** Nhãn trạng thái: luôn có chữ (và icon), không chỉ dựa vào màu. */
export function StatusBadge({ tone, children }: { tone: Tone; children: ReactNode }) {
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${TONES[tone]}`}>{children}</span>
}

export function PageHeader({ eyebrow, title, right }: { eyebrow?: string; title: ReactNode; right?: ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        {eyebrow && <div className="text-xs font-bold tracking-[0.2em] text-indigo-400 uppercase">{eyebrow}</div>}
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h1>
      </div>
      {right}
    </div>
  )
}
