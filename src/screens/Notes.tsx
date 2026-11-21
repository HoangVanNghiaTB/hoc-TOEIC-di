import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { deleteNote, saveNote, setNoteSrs, useStore } from '../lib/store'
import type { Note } from '../lib/store'
import { schedule } from '../lib/srs'
import type { Grade } from '../lib/srs'
import { takeDraft } from '../lib/notesBus'
import { sfx } from '../lib/audio'

const CLOZE = /\[\[(.+?)\]\]/g
const clozeOf = (body: string) => Array.from(body.matchAll(CLOZE)).map((m) => m[1])
const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, '').replace(/\s+/g, ' ').trim()

/** In đậm **chữ** và nổi bật [[từ khóa]] trong một dòng. */
function inline(text: string, key: string): ReactNode[] {
  const out: ReactNode[] = []
  const re = /(\*\*(.+?)\*\*|\[\[(.+?)\]\])/g
  let last = 0
  let i = 0
  for (const m of text.matchAll(re)) {
    const at = m.index ?? 0
    if (at > last) out.push(text.slice(last, at))
    if (m[2] !== undefined) out.push(<b key={`${key}b${i}`}>{m[2]}</b>)
    else out.push(<mark key={`${key}m${i}`} className="rounded bg-yellow-200 px-1">{m[3]}</mark>)
    last = at + m[0].length
    i += 1
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

/** Bộ hiển thị markdown rất nhỏ: tiêu đề #, gạch đầu dòng, in đậm. */
function Body({ text }: { text: string }) {
  return (
    <div className="space-y-1 text-[15px] leading-relaxed">
      {text.split('\n').map((line, i) => {
        const h = line.match(/^(#{1,4})\s+(.*)$/)
        if (h) return <div key={i} className="pt-1 font-bold text-indigo-700">{inline(h[2], `h${i}`)}</div>
        const b = line.match(/^\s*[-*•]\s+(.*)$/)
        if (b) return <div key={i} className="flex gap-2 pl-2"><span>•</span><span>{inline(b[1], `l${i}`)}</span></div>
        if (!line.trim()) return <div key={i} className="h-2" />
        return <div key={i}>{inline(line, `p${i}`)}</div>
      })}
    </div>
  )
}

type View = { kind: 'list' } | { kind: 'edit'; id?: string; draft?: { title: string; body: string; tags: string[] } } | { kind: 'view'; id: string } | { kind: 'review'; ids: string[] }

export default function Notes() {
  const s = useStore()
  const [view, setView] = useState<View>({ kind: 'list' })
  const took = useRef(false)

  useEffect(() => {
    if (took.current) return
    took.current = true
    const d = takeDraft()
    if (d) setView({ kind: 'edit', draft: d })
  }, [])

  if (view.kind === 'edit') {
    const existing = view.id ? s.notes.find((n) => n.id === view.id) : undefined
    return (
      <Editor
        key={view.id ?? 'new'}
        initial={existing ?? view.draft ?? { title: '', body: '', tags: [] }}
        onCancel={() => setView(view.id ? { kind: 'view', id: view.id } : { kind: 'list' })}
        onSave={(n) => {
          const id = saveNote({ ...n, id: view.id })
          setView({ kind: 'view', id })
        }}
      />
    )
  }

  if (view.kind === 'view') {
    const n = s.notes.find((x) => x.id === view.id)
    if (!n) return <div className="rounded-3xl bg-white p-5 shadow">Không tìm thấy ghi chú. <button className="text-indigo-600 underline" onClick={() => setView({ kind: 'list' })}>Về danh sách</button></div>
    return (
      <div className="space-y-3">
        <button onClick={() => setView({ kind: 'list' })} className="text-sm text-indigo-600">← Danh sách ghi chú</button>
        <div className="rounded-3xl bg-white p-5 shadow">
          <h2 className="text-lg font-extrabold">{n.title || '(Chưa có tiêu đề)'}</h2>
          {n.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {n.tags.map((t) => <span key={t} className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-600">#{t}</span>)}
            </div>
          )}
          <div className="mt-4"><Body text={n.body} /></div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => setView({ kind: 'review', ids: [n.id] })} className="rounded-2xl bg-indigo-600 py-3 font-bold text-white">Ôn ghi chú này</button>
          <button onClick={() => setView({ kind: 'edit', id: n.id })} className="rounded-2xl bg-slate-200 py-3 font-bold">Sửa</button>
          <button
            onClick={() => {
              if (confirm('Xóa ghi chú này? Không thể hoàn tác.')) {
                deleteNote(n.id)
                setView({ kind: 'list' })
              }
            }}
            className="rounded-2xl bg-rose-100 py-3 font-bold text-rose-600"
          >
            Xóa
          </button>
        </div>
      </div>
    )
  }

  if (view.kind === 'review') {
    return <Review ids={view.ids} onExit={() => setView({ kind: 'list' })} />
  }

  return <List onOpen={(id) => setView({ kind: 'view', id })} onNew={() => setView({ kind: 'edit' })} onReview={(ids) => setView({ kind: 'review', ids })} />
}

// ------------------------------------------------------------ Danh sách
function List({ onOpen, onNew, onReview }: { onOpen: (id: string) => void; onNew: () => void; onReview: (ids: string[]) => void }) {
  const s = useStore()
  const [q, setQ] = useState('')
  const [tag, setTag] = useState('')
  const now = Date.now()

  const tags = useMemo(() => Array.from(new Set(s.notes.flatMap((n) => n.tags))).sort(), [s.notes])
  const filtered = s.notes.filter((n) => {
    if (tag && !n.tags.includes(tag)) return false
    if (!q.trim()) return true
    const k = q.toLowerCase()
    return n.title.toLowerCase().includes(k) || n.body.toLowerCase().includes(k) || n.tags.some((t) => t.toLowerCase().includes(k))
  })
  const due = s.notes.filter((n) => n.srs.due <= now)

  return (
    <div className="space-y-3">
      <div className="rounded-3xl bg-white p-5 shadow">
        <h2 className="text-lg font-extrabold">📝 Ghi chú của tôi</h2>
        <p className="mt-1 text-sm text-slate-500">
          Dán lời giải thích từ AI bên ngoài vào đây. Đặt từ khóa trong <b>[[hai ngoặc vuông]]</b> để web ẩn đi và hỏi lại bạn khi ôn.
        </p>
        <div className="mt-3 flex gap-2">
          <button onClick={onNew} className="flex-1 rounded-2xl bg-emerald-500 py-3 font-bold text-white shadow">+ Ghi chú mới</button>
          <button
            onClick={() => onReview(due.map((n) => n.id))}
            disabled={due.length === 0}
            className="flex-1 rounded-2xl bg-indigo-600 py-3 font-bold text-white shadow disabled:bg-slate-300"
          >
            Ôn ({due.length})
          </button>
        </div>
        {due.length === 0 && s.notes.length > 0 && (
          <button onClick={() => onReview(s.notes.map((n) => n.id))} className="mt-2 text-xs text-slate-400 underline">
            Chưa có ghi chú đến hạn — ôn tất cả
          </button>
        )}
      </div>

      {s.notes.length > 0 && (
        <>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm trong ghi chú…"
            className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-400"
          />
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              <button onClick={() => setTag('')} className={`rounded-full px-3 py-1 text-xs ${tag === '' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500'}`}>Tất cả</button>
              {tags.map((t) => (
                <button key={t} onClick={() => setTag(tag === t ? '' : t)} className={`rounded-full px-3 py-1 text-xs ${tag === t ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500'}`}>#{t}</button>
              ))}
            </div>
          )}
        </>
      )}

      {s.notes.length === 0 && (
        <div className="rounded-3xl bg-white p-6 text-center text-sm text-slate-500 shadow">
          Chưa có ghi chú nào. Khi gặp câu khó, bấm <b>📋 Chép để hỏi AI</b>, dán vào claude.ai, rồi bấm <b>📝 Ghi chú</b> để lưu lại lời giải thích tại đây.
        </div>
      )}

      {filtered.map((n) => {
        const isDue = n.srs.due <= now
        const blanks = clozeOf(n.body).length
        return (
          <button key={n.id} onClick={() => onOpen(n.id)} className="block w-full rounded-2xl bg-white px-4 py-3 text-left shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="font-bold">{n.title || '(Chưa có tiêu đề)'}</div>
              {isDue && <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700">cần ôn</span>}
            </div>
            <div className="mt-1 line-clamp-2 text-sm text-slate-500">{n.body.replace(/\[\[|\]\]/g, '').replace(/[#*]/g, '')}</div>
            <div className="mt-1 flex flex-wrap items-center gap-1 text-xs text-slate-400">
              {n.tags.map((t) => <span key={t}>#{t}</span>)}
              {blanks > 0 && <span>· {blanks} chỗ ẩn</span>}
            </div>
          </button>
        )
      })}
      {s.notes.length > 0 && filtered.length === 0 && <p className="text-center text-sm text-slate-400">Không tìm thấy ghi chú phù hợp.</p>}
    </div>
  )
}

// ------------------------------------------------------------ Soạn ghi chú
function Editor({ initial, onSave, onCancel }: { initial: { title: string; body: string; tags: string[] }; onSave: (n: { title: string; body: string; tags: string[] }) => void; onCancel: () => void }) {
  const [title, setTitle] = useState(initial.title)
  const [body, setBody] = useState(initial.body)
  const [tags, setTags] = useState(initial.tags.join(', '))
  const ta = useRef<HTMLTextAreaElement>(null)

  function wrap() {
    const el = ta.current
    if (!el) return
    const { selectionStart: a, selectionEnd: b } = el
    if (a === b) return
    const sel = body.slice(a, b)
    const next = body.slice(0, a) + '[[' + sel + ']]' + body.slice(b)
    setBody(next)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(a, b + 4)
    })
  }

  const blanks = clozeOf(body).length
  const canSave = title.trim() || body.trim()

  return (
    <div className="space-y-3">
      <button onClick={onCancel} className="text-sm text-indigo-600">← Hủy</button>
      <div className="space-y-3 rounded-3xl bg-white p-5 shadow">
        <label className="block text-sm font-bold">Tiêu đề (câu hỏi hoặc chủ đề — web sẽ hỏi bạn bằng dòng này)
          <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} placeholder="Ví dụ: Khác nhau giữa since và for?" className="mt-1 w-full rounded-2xl border-2 border-slate-200 px-4 py-3 font-normal outline-none focus:border-indigo-400" />
        </label>
        <label className="block text-sm font-bold">Thẻ (cách nhau bằng dấu phẩy)
          <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="ngữ pháp, part 5" className="mt-1 w-full rounded-2xl border-2 border-slate-200 px-4 py-3 font-normal outline-none focus:border-indigo-400" />
        </label>
        <label className="block text-sm font-bold">Nội dung (dán từ AI vào đây)
          <textarea ref={ta} value={body} onChange={(e) => setBody(e.target.value)} rows={12} className="mt-1 w-full rounded-2xl border-2 border-slate-200 px-4 py-3 font-normal leading-relaxed outline-none focus:border-indigo-400" />
        </label>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <button onClick={wrap} className="rounded-full bg-yellow-100 px-3 py-1 font-semibold text-yellow-800">🔒 Ẩn phần đang chọn</button>
          <span className="text-xs text-slate-400">{blanks > 0 ? `${blanks} chỗ ẩn khi ôn` : 'Bôi đen từ khóa rồi bấm nút để ẩn khi ôn'}</span>
        </div>
        <p className="text-xs text-slate-400">Hỗ trợ: <b>**in đậm**</b>, dòng bắt đầu bằng # là tiêu đề, dòng bắt đầu bằng - là gạch đầu dòng.</p>
      </div>
      <button
        onClick={() => onSave({ title, body, tags: tags.split(',').map((t) => t.trim().replace(/^#/, '')).filter(Boolean).slice(0, 8) })}
        disabled={!canSave}
        className="w-full rounded-2xl bg-emerald-500 py-4 font-bold text-white shadow disabled:bg-slate-300"
      >
        Lưu ghi chú
      </button>
    </div>
  )
}

// ------------------------------------------------------------ Ôn ghi chú
const GRADES: { g: Grade; label: string; color: string }[] = [
  { g: 0, label: 'Quên', color: 'bg-rose-500' },
  { g: 1, label: 'Khó', color: 'bg-orange-500' },
  { g: 2, label: 'Nhớ', color: 'bg-emerald-500' },
  { g: 3, label: 'Dễ', color: 'bg-sky-500' },
]

function Review({ ids, onExit }: { ids: string[]; onExit: () => void }) {
  const s = useStore()
  const [queue, setQueue] = useState<string[]>(() => [...ids])
  const [done, setDone] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [answers, setAnswers] = useState<string[]>([])

  const note: Note | undefined = s.notes.find((n) => n.id === queue[0])

  useEffect(() => {
    setRevealed(false)
    setAnswers([])
  }, [queue[0]])

  if (!note) {
    return (
      <div className="pop rounded-3xl bg-white p-8 text-center shadow">
        <div className="text-6xl">{done > 0 ? '🎉' : '✅'}</div>
        <h2 className="mt-3 text-xl font-extrabold">{done > 0 ? 'Ôn xong ghi chú!' : 'Không có ghi chú nào để ôn'}</h2>
        {done > 0 && <p className="mt-2 text-slate-500">Đã chấm {done} lượt.</p>}
        <button onClick={onExit} className="mt-5 rounded-2xl bg-indigo-600 px-6 py-3 font-bold text-white">Về danh sách</button>
      </div>
    )
  }

  const clozes = clozeOf(note.body)
  const parts = note.body.split(CLOZE) // chỉ số lẻ là phần bị ẩn
  const results = clozes.map((c, i) => norm(answers[i] ?? '') === norm(c))

  function grade(g: Grade) {
    setNoteSrs(note!.id, schedule(note!.srs, g), g > 0 ? 3 : 1)
    if (g === 0) sfx.bad()
    else sfx.good()
    setDone((d) => d + 1)
    setQueue((q) => (g === 0 ? [...q.slice(1), q[0]] : q.slice(1)))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-slate-500">
        <button onClick={onExit} className="text-indigo-600">← Thoát</button>
        <span>Còn {queue.length} · đã chấm {done}</span>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-lg">
        <div className="text-xs font-bold text-slate-400">Hãy nhớ lại nội dung của:</div>
        <h2 className="mt-1 text-xl font-extrabold text-indigo-700">{note.title || '(Chưa có tiêu đề)'}</h2>

        {!revealed ? (
          clozes.length > 0 ? (
            <div className="mt-4 whitespace-pre-wrap text-[15px] leading-relaxed">
              {parts.map((p, i) =>
                i % 2 === 0 ? (
                  <span key={i}>{p.replace(/\*\*/g, '')}</span>
                ) : (
                  <input
                    key={i}
                    value={answers[(i - 1) / 2] ?? ''}
                    onChange={(e) => setAnswers((a) => { const n = [...a]; n[(i - 1) / 2] = e.target.value; return n })}
                    size={Math.max(4, Math.min(18, p.length + 1))}
                    placeholder="…"
                    className="mx-1 rounded-lg border-b-2 border-indigo-300 bg-indigo-50 px-2 py-0.5 text-center outline-none focus:border-indigo-600"
                  />
                ),
              )}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-400">Tự nhớ lại nội dung ghi chú này, rồi bấm “Hiện ghi chú” để đối chiếu.</p>
          )
        ) : (
          <div className="mt-4">
            {clozes.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1 text-sm">
                {clozes.map((c, i) => (
                  <span key={i} className={`rounded-full px-2 py-0.5 ${results[i] ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {results[i] ? '✔' : '✘'} {c}
                    {!results[i] && answers[i] ? <span className="opacity-60"> (bạn gõ: {answers[i]})</span> : null}
                  </span>
                ))}
              </div>
            )}
            <Body text={note.body} />
          </div>
        )}
      </div>

      {!revealed ? (
        <button onClick={() => setRevealed(true)} className="w-full rounded-2xl bg-indigo-600 py-4 font-bold text-white shadow">
          {clozes.length > 0 ? 'Kiểm tra & hiện ghi chú' : 'Hiện ghi chú'}
        </button>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {GRADES.map((b) => (
            <button key={b.g} onClick={() => grade(b.g)} className={`${b.color} rounded-2xl py-4 font-bold text-white shadow active:scale-95`}>{b.label}</button>
          ))}
        </div>
      )}
    </div>
  )
}
