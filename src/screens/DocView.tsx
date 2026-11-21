import type { ReactNode } from 'react'

/**
 * Hiển thị văn bản Part 6/7 theo bố cục giống đề thật (email, thông báo, tin nhắn, lịch, bảng, hóa đơn).
 * Tự nhận dạng từ văn bản thuần, nên không cần sửa dữ liệu bài cũ.
 *
 * Quy ước trong văn bản:
 *  - Dòng `— Tên —` tách nhiều tài liệu (email 1, email 2, quảng cáo…).
 *  - Dòng đầu `To:/From:/Subject:/Date:` là phần đầu email.
 *  - `Tên (9:05 a.m.): nội dung` là tin nhắn.
 *  - Dòng bắt đầu bằng giờ `9:00 a.m. …` là lịch.
 *  - Hai dòng liền nhau dạng `Nhãn: giá trị` là bảng chi tiết.
 *  - Dòng bắt đầu bằng `|` là bảng; dòng đầu của bảng là tiêu đề cột.
 */

type Block =
  | { t: 'p'; text: string }
  | { t: 'table'; rows: string[][] }
  | { t: 'kv'; rows: [string, string][] }
  | { t: 'sched'; rows: [string, string][] }

type Seg = {
  label?: string
  kind: 'email' | 'chat' | 'doc'
  header: [string, string][]
  chat: { who: string; time: string; msg: string }[]
  title?: string
  subtitle?: string[]
  blocks: Block[]
}

const SPLIT = /^—\s*(.+?)\s*—$/
const CHAT = /^([A-Z][\w.'-]*(?: [\w.'-]+){0,2}) \((\d{1,2}:\d{2}\s?[ap]\.m\.)\):\s*(.*)$/
const HDR = /^(To|From|Subject|Date|Cc|Re|Sent):\s*(.*)$/i
const TIME = /^(\d{1,2}(?::\d{2})?\s?[ap]\.m\.)\s*[–-]?\s*(.+)$/
const KV = /^([A-Z][A-Za-z ]{1,22}):\s+(.+)$/

function parseSeg(raw: string, label?: string): Seg {
  const lines = raw.replace(/\r/g, '').split('\n')
  while (lines.length && !lines[0].trim()) lines.shift()
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop()

  const seg: Seg = { label, kind: 'doc', header: [], chat: [], blocks: [] }

  // Tin nhắn
  const chatLines = lines.filter((l) => CHAT.test(l.trim()))
  if (chatLines.length >= 2 && chatLines.length >= lines.filter((l) => l.trim()).length - 1) {
    seg.kind = 'chat'
    for (const l of lines) {
      const m = CHAT.exec(l.trim())
      if (m) seg.chat.push({ who: m[1], time: m[2], msg: m[3] })
    }
    return seg
  }

  // Phần đầu email
  let i = 0
  while (i < lines.length && HDR.test(lines[i].trim())) {
    const m = HDR.exec(lines[i].trim())!
    seg.header.push([m[1][0].toUpperCase() + m[1].slice(1).toLowerCase(), m[2]])
    i++
  }
  if (seg.header.length) seg.kind = 'email'
  while (i < lines.length && !lines[i].trim()) i++
  const rest = lines.slice(i)
  if (!seg.header.length && /^Dear\b/i.test(rest[0]?.trim() ?? '')) seg.kind = 'email' // thư không có phần đầu

  // Tiêu đề (nhóm dòng ngắn đầu tiên, không phải câu / lời chào)
  let k = 0
  if (!seg.header.length) {
    const group: string[] = []
    while (k < rest.length && rest[k].trim()) group.push(rest[k++].trim())
    const isTitle =
      group.length > 0 &&
      group.length <= 3 &&
      group.every((g) => g.length <= 70 && (!/[.,:;]$/.test(g) || /\b(Co|Inc|Ltd|Corp)\.$/.test(g)) && !/^Dear\b/i.test(g) && !TIME.test(g) && !g.startsWith('|') && !KV.test(g))
    if (isTitle) {
      seg.title = group[0]
      seg.subtitle = group.slice(1)
    } else {
      k = 0
    }
  }

  // Thân bài
  let para: string[] = []
  const flush = () => {
    if (para.length) seg.blocks.push({ t: 'p', text: para.join('\n') })
    para = []
  }
  let j = k
  while (j < rest.length) {
    const line = rest[j].trim()
    if (!line) {
      flush()
      j++
      continue
    }
    if (line.startsWith('|')) {
      flush()
      const rows: string[][] = []
      while (j < rest.length && rest[j].trim().startsWith('|')) {
        rows.push(
          rest[j]
            .trim()
            .replace(/^\||\|$/g, '')
            .split('|')
            .map((c) => c.trim()),
        )
        j++
      }
      seg.blocks.push({ t: 'table', rows })
      continue
    }
    if (TIME.test(line)) {
      flush()
      const rows: [string, string][] = []
      while (j < rest.length && TIME.test(rest[j].trim())) {
        const m = TIME.exec(rest[j].trim())!
        rows.push([m[1], m[2]])
        j++
      }
      seg.blocks.push({ t: 'sched', rows })
      continue
    }
    if (KV.test(line) && j + 1 < rest.length && KV.test(rest[j + 1].trim())) {
      flush()
      const rows: [string, string][] = []
      while (j < rest.length && KV.test(rest[j].trim())) {
        const m = KV.exec(rest[j].trim())!
        rows.push([m[1], m[2]])
        j++
      }
      seg.blocks.push({ t: 'kv', rows })
      continue
    }
    para.push(line)
    j++
  }
  flush()
  return seg
}

function parse(text: string): Seg[] {
  const segs: Seg[] = []
  let label: string | undefined
  let buf: string[] = []
  const push = () => {
    if (buf.join('').trim()) segs.push(parseSeg(buf.join('\n'), label))
    buf = []
  }
  for (const l of text.replace(/\r/g, '').split('\n')) {
    const m = SPLIT.exec(l.trim())
    if (m) {
      push()
      label = m[1]
    } else buf.push(l)
  }
  push()
  return segs
}

/** Tô nổi chỗ trống [1] [2] [3] của Part 6. */
function inline(text: string): ReactNode {
  return text.split(/(\[\d\])/).map((seg, i) =>
    /^\[\d\]$/.test(seg) ? (
      <span key={i} className="mx-0.5 rounded bg-indigo-100 px-1.5 font-bold text-indigo-700">
        {seg}
      </span>
    ) : (
      <span key={i}>{seg}</span>
    ),
  )
}

const KIND_LABEL = { email: '✉️ Email / Thư', chat: '💬 Tin nhắn', doc: '📄 Thông báo / Bài viết' }

function BlockView({ b }: { b: Block }) {
  if (b.t === 'p') return <p className="whitespace-pre-line leading-relaxed">{inline(b.text)}</p>
  if (b.t === 'sched')
    return (
      <table className="w-full overflow-hidden rounded-xl border border-slate-200 text-sm">
        <tbody>
          {b.rows.map(([t, e], i) => (
            <tr key={i} className={i % 2 ? 'bg-slate-50' : 'bg-white'}>
              <td className="w-28 whitespace-nowrap border-r border-slate-200 px-3 py-1.5 font-bold text-indigo-700">{t}</td>
              <td className="px-3 py-1.5">{inline(e)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  if (b.t === 'kv')
    return (
      <table className="w-full overflow-hidden rounded-xl border border-slate-200 text-sm">
        <tbody>
          {b.rows.map(([k, v], i) => (
            <tr key={i} className={i % 2 ? 'bg-slate-50' : 'bg-white'}>
              <td className="w-32 border-r border-slate-200 px-3 py-1.5 font-bold text-slate-600">{k}</td>
              <td className="px-3 py-1.5">{inline(v)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  const [head, ...body] = b.rows
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[18rem] overflow-hidden rounded-xl border border-slate-200 text-sm">
        <thead className="bg-indigo-600 text-white">
          <tr>
            {head.map((h, i) => (
              <th key={i} className="px-3 py-1.5 text-left font-bold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((r, i) => (
            <tr key={i} className={i % 2 ? 'bg-slate-50' : 'bg-white'}>
              {r.map((c, k) => (
                <td key={k} className={`border-t border-slate-200 px-3 py-1.5 ${k === r.length - 1 && /^[$€£]?[\d.,]+%?$/.test(c.replace(/\s/g, '')) ? 'text-right font-semibold' : ''}`}>
                  {inline(c)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SegView({ seg }: { seg: Seg }) {
  const names = [...new Set(seg.chat.map((c) => c.who))]
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between bg-slate-100 px-4 py-1.5 text-xs font-bold text-slate-500">
        <span>{KIND_LABEL[seg.kind]}</span>
        {seg.label && <span className="rounded-full bg-white px-2 py-0.5 text-indigo-700">{seg.label}</span>}
      </div>
      <div className="space-y-3 p-4 text-[15px] text-slate-800">
        {seg.kind === 'email' && seg.header.length > 0 && (
          <div className="space-y-0.5 border-b border-slate-200 pb-3 text-sm">
            {seg.header.map(([k, v], i) => (
              <div key={i} className="flex gap-2">
                <span className="w-16 shrink-0 font-bold text-slate-500">{k}:</span>
                <span className={k === 'Subject' || k === 'Re' ? 'font-bold' : ''}>{inline(v)}</span>
              </div>
            ))}
          </div>
        )}
        {seg.title && (
          <div className="border-b-2 border-indigo-500 pb-2 text-center">
            <div className="text-lg font-extrabold text-indigo-900">{inline(seg.title)}</div>
            {seg.subtitle?.map((s, i) => (
              <div key={i} className="text-sm text-slate-500">
                {inline(s)}
              </div>
            ))}
          </div>
        )}
        {seg.kind === 'chat' ? (
          <div className="space-y-2">
            {seg.chat.map((c, i) => {
              const right = names.indexOf(c.who) % 2 === 1
              return (
                <div key={i} className={`flex flex-col ${right ? 'items-end' : 'items-start'}`}>
                  <div className="text-[11px] text-slate-400">
                    {c.who} · {c.time}
                  </div>
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${right ? 'rounded-tr-sm bg-indigo-600 text-white' : 'rounded-tl-sm bg-slate-100'}`}>{inline(c.msg)}</div>
                </div>
              )
            })}
          </div>
        ) : (
          seg.blocks.map((b, i) => <BlockView key={i} b={b} />)
        )}
      </div>
    </div>
  )
}

export default function DocView({ text }: { text: string }) {
  const segs = parse(text)
  return (
    <div className="mt-3 space-y-3">
      {segs.map((s, i) => (
        <SegView key={i} seg={s} />
      ))}
    </div>
  )
}
