import { useState } from 'react'
import { dayStr, useStore } from '../lib/store'

const INK = '#f8fafc'
const MUTED = '#aebbcd'
const GRID = '#344255'
const SERIES = '#ff6533'

const dayLabel = (d: string) => {
  const [, m, dd] = d.split('-')
  return `${Number(dd)}/${Number(m)}`
}

/** Cột có hai góc trên bo tròn 4px, đáy phẳng nằm trên đường nền. */
function barPath(x: number, y: number, w: number, h: number, r = 4) {
  const rr = Math.min(r, w / 2, h)
  return `M${x},${y + h} V${y + rr} Q${x},${y} ${x + rr},${y} H${x + w - rr} Q${x + w},${y} ${x + w},${y + rr} V${y + h} Z`
}

export default function ProgressChart() {
  const s = useStore()
  const [hover, setHover] = useState<number | null>(null)
  const [table, setTable] = useState(false)

  const today = dayStr()
  const days = Array.from({ length: 14 }, (_, k) => {
    const d = dayStr(new Date(Date.now() - (13 - k) * 86400000))
    const v = d === today ? (s.daily.date === today ? s.daily : { xp: 0, reviewed: 0 }) : (s.dayLog[d] ?? { xp: 0, reviewed: 0 })
    return { d, xp: v.xp, cards: v.reviewed }
  })
  const max = Math.max(50, ...days.map((x) => x.xp))
  const top = Math.ceil(max / 50) * 50

  const W = 320
  const H = 130
  const L = 30
  const B = 20
  const T = 8
  const plotH = H - B - T
  const slot = (W - L - 4) / days.length
  const bw = slot - 2 // khe 2px giữa các cột
  const y = (v: number) => T + plotH - (v / top) * plotH

  const tests = s.tests.slice(-8)
  const active = hover !== null ? days[hover] : null

  return (
    <section className="rounded-3xl bg-white p-5 shadow">
      <div className="flex items-center justify-between">
        <h2 className="font-bold">📈 XP mỗi ngày (14 ngày gần nhất)</h2>
        <button onClick={() => setTable((t) => !t)} className="text-xs text-indigo-600 underline">
          {table ? 'Xem biểu đồ' : 'Xem bảng'}
        </button>
      </div>

      {!table ? (
        <>
          <div className="mt-1 h-5 text-sm" aria-live="polite" style={{ color: INK }}>
            {active ? (
              <>
                <b>{dayLabel(active.d)}</b> · {active.xp} XP · {active.cards} thẻ
              </>
            ) : (
              <span style={{ color: MUTED }}>Chạm hoặc rê vào một cột để xem chi tiết</span>
            )}
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} className="mt-1 w-full" role="img" aria-label="Biểu đồ cột: XP kiếm được mỗi ngày trong 14 ngày gần nhất">
            {[0, 0.5, 1].map((f) => (
              <g key={f}>
                <line x1={L} x2={W - 4} y1={y(top * f)} y2={y(top * f)} stroke={GRID} strokeWidth={f === 0 ? 1.5 : 1} />
                <text x={L - 4} y={y(top * f) + 3} textAnchor="end" fontSize="9" fill={MUTED}>
                  {Math.round(top * f)}
                </text>
              </g>
            ))}
            {days.map((x, k) => {
              const h = (x.xp / top) * plotH
              const bx = L + k * slot + 1
              return (
                <g key={x.d}>
                  {x.xp > 0 && <path d={barPath(bx, y(x.xp), bw, Math.max(h, 2))} fill={SERIES} opacity={hover === null || hover === k ? 1 : 0.45} />}
                  {/* vùng chạm cao hơn cột */}
                  <rect
                    x={bx - 1}
                    y={T}
                    width={slot}
                    height={plotH}
                    fill="transparent"
                    tabIndex={0}
                    aria-label={`${dayLabel(x.d)}: ${x.xp} XP, ${x.cards} thẻ`}
                    onMouseEnter={() => setHover(k)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(k)}
                    onBlur={() => setHover(null)}
                    onClick={() => setHover(k)}
                  />
                  {((k % 3 === 0 && days.length - 1 - k > 1) || k === days.length - 1) && (
                    <text x={bx + bw / 2} y={H - 5} textAnchor="middle" fontSize="9" fill={MUTED}>
                      {dayLabel(x.d)}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>
        </>
      ) : (
        <table className="mt-2 w-full text-left text-sm">
          <thead>
            <tr className="text-xs text-slate-400">
              <th className="py-1">Ngày</th>
              <th>XP</th>
              <th>Thẻ</th>
            </tr>
          </thead>
          <tbody>
            {[...days].reverse().map((x) => (
              <tr key={x.d} className="border-t border-slate-100">
                <td className="py-1">{dayLabel(x.d)}</td>
                <td>{x.xp}</td>
                <td>{x.cards}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 className="mt-5 font-bold">📝 Điểm thi thử (ước tính rất thô)</h2>
      {tests.length === 0 ? (
        <p className="mt-1 text-sm text-slate-500">Chưa có bài thi thử nào. Vào tab “Luyện đề” → “Thi thử rút gọn” để bắt đầu theo dõi.</p>
      ) : (
        <>
          <ScoreLine scores={tests.map((t) => t.score)} dates={tests.map((t) => t.date)} />
          <ul className="mt-2 space-y-1 text-sm">
            {[...tests].reverse().slice(0, 5).map((t, k) => (
              <li key={k} className="flex justify-between border-t border-slate-100 py-1">
                <span>{dayLabel(t.date)}</span>
                <span>
                  ~{t.score} <span className="text-slate-400">(nghe {t.listening.ok}/{t.listening.total} · đọc {t.reading.ok}/{t.reading.total})</span>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}

function ScoreLine({ scores, dates }: { scores: number[]; dates: string[] }) {
  const W = 320
  const H = 110
  const L = 30
  const T = 12
  const B = 20
  const R = 28
  const plotH = H - T - B
  const max = 990
  const x = (i: number) => (scores.length === 1 ? L + (W - L - R) / 2 : L + (i * (W - L - R)) / (scores.length - 1))
  const y = (v: number) => T + plotH - (v / max) * plotH
  const pts = scores.map((v, i) => `${x(i)},${y(v)}`).join(' ')
  const last = scores.length - 1
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mt-1 w-full" role="img" aria-label={`Điểm thi thử ước tính qua các lần, gần nhất ${scores[last]}`}>
      {[0, 600, 990].map((v) => (
        <g key={v}>
          <line x1={L} x2={W - 4} y1={y(v)} y2={y(v)} stroke={v === 600 ? '#fb7185' : GRID} strokeWidth={v === 600 ? 1.5 : 1} strokeDasharray={v === 600 ? '4 3' : undefined} />
          <text x={L - 4} y={y(v) + 3} textAnchor="end" fontSize="9" fill={MUTED}>
            {v}
          </text>
        </g>
      ))}
      <text x={W - 4} y={y(600) - 3} textAnchor="end" fontSize="9" fill={MUTED}>
        mục tiêu 600
      </text>
      {scores.length > 1 && <polyline points={pts} fill="none" stroke={SERIES} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />}
      {scores.map((v, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(v)} r={4} fill={SERIES} stroke="#172131" strokeWidth={2}>
            <title>{`${dates[i]}: ~${v}`}</title>
          </circle>
          {i === last && (
            <text x={x(i)} y={y(v) - 8} textAnchor="middle" fontSize="10" fontWeight="bold" fill={INK}>
              {v}
            </text>
          )}
        </g>
      ))}
    </svg>
  )
}
