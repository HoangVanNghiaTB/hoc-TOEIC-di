import { useState } from 'react'
import { askTeacher } from '../lib/tutor'
import type { AskCtx } from '../lib/tutor'
import { draftNote } from '../lib/notesBus'
import { buildExternalPrompt, buildNoteDraft } from '../lib/askPrompt'

/**
 * Ba lối đi cho một câu hỏi khó:
 *  - Chép câu lệnh để dán vào AI bên ngoài (claude.ai…).
 *  - Mở ghi chú nháp điền sẵn để dán lời giải thích về.
 *  - (Nếu đã bật) hỏi giáo viên AI trong web.
 */
export default function AskButton({
  ctx,
  label = '🧑‍🏫 Hỏi giáo viên AI',
  className = '',
  compact = false,
}: {
  ctx: AskCtx
  label?: string
  className?: string
  compact?: boolean
}) {
  const [msg, setMsg] = useState('')

  async function copy() {
    const text = buildExternalPrompt(ctx)
    try {
      await navigator.clipboard.writeText(text)
      setMsg('Đã chép! Dán vào claude.ai để hỏi.')
    } catch {
      window.prompt('Chép đoạn này rồi dán vào AI:', text)
      setMsg('')
    }
    setTimeout(() => setMsg(''), 3500)
  }

  const btn = 'rounded-full px-3 py-1 text-sm font-semibold'
  return (
    <span className={`inline-flex flex-wrap items-center gap-2 ${className}`}>
      <button
        onClick={(e) => {
          e.stopPropagation()
          void copy()
        }}
        className={`${btn} bg-sky-100 text-sky-700`}
      >
        📋 {compact ? 'Chép' : 'Chép để hỏi AI'}
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation()
          draftNote(buildNoteDraft(ctx))
        }}
        className={`${btn} bg-emerald-100 text-emerald-700`}
      >
        📝 Ghi chú
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation()
          askTeacher(ctx)
        }}
        className={`${btn} bg-violet-100 text-violet-700`}
      >
        {label}
      </button>
      {msg && <span className="text-xs text-emerald-600">{msg}</span>}
    </span>
  )
}
