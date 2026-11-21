import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }

/** CTA chính: nền cam. */
export function PrimaryButton({ children, className = '', ...rest }: Props) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 font-bold text-white shadow transition hover:bg-indigo-500 active:scale-[0.97] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 ${className}`}
    >
      {children}
    </button>
  )
}

/** CTA phụ: nền tối, viền. */
export function SecondaryButton({ children, className = '', ...rest }: Props) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 font-bold text-slate-800 transition hover:border-slate-300 hover:bg-slate-100 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}

/** Nút nhỏ chỉ có icon; bắt buộc có `label` để đọc màn hình. */
export function IconButton({ icon, label, className = '', ...rest }: Omit<Props, 'children'> & { icon: ReactNode; label: string }) {
  return (
    <button
      {...rest}
      aria-label={label}
      title={label}
      className={`flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-lg transition hover:border-indigo-400 hover:bg-slate-100 ${className}`}
    >
      {icon}
    </button>
  )
}
