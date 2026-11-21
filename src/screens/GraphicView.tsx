import { useState } from 'react'
import type { Graphic } from '../data/parts'

/** Hình đi kèm bài nghe Part 3/4: bảng, biểu đồ cột, sơ đồ mặt bằng. Có thể xem dạng bảng số liệu. */
export default function GraphicView({ g }: { g: Graphic }) {
  const [asTable, setAsTable] = useState(false)

  return (
    <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="text-sm font-bold text-slate-700">📊 {g.title}</div>
        {g.type === 'bars' && (
          <button onClick={() => setAsTable((v) => !v)} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">
            {asTable ? 'Xem biểu đồ' : 'Xem số liệu'}
          </button>
        )}
      </div>

      {g.type === 'table' && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[16rem] overflow-hidden rounded-xl border border-slate-200 text-sm">
            <thead className="bg-indigo-600 text-white">
              <tr>
                {g.headers.map((h, i) => (
                  <th key={i} className="px-3 py-1.5 text-left font-bold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {g.rows.map((r, i) => (
                <tr key={i} className={i % 2 ? 'bg-slate-50' : 'bg-white'}>
                  {r.map((c, k) => (
                    <td key={k} className={`border-t border-slate-200 px-3 py-1.5 ${k === 0 ? 'font-bold' : ''}`}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {g.type === 'bars' &&
        (asTable ? (
          <table className="w-full overflow-hidden rounded-xl border border-slate-200 text-sm">
            <tbody>
              {g.data.map(([l, v], i) => (
                <tr key={i} className={i % 2 ? 'bg-slate-50' : 'bg-white'}>
                  <td className="px-3 py-1.5 font-bold">{l}</td>
                  <td className="px-3 py-1.5 text-right">
                    {v}
                    {g.unit ?? ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="space-y-1.5">
            {(() => {
              const max = Math.max(...g.data.map(([, v]) => v), 1)
              return g.data.map(([l, v], i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="w-12 shrink-0 font-bold text-slate-600">{l}</span>
                  <div className="h-5 flex-1 rounded-r-md bg-slate-100">
                    <div className="h-full rounded-r-md bg-indigo-500" style={{ width: `${(v / max) * 100}%` }} />
                  </div>
                  <span className="w-14 shrink-0 text-right font-semibold">
                    {v}
                    {g.unit ?? ''}
                  </span>
                </div>
              ))
            })()}
          </div>
        ))}

      {g.type === 'grid' && (
        <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${Math.max(...g.cells.map((r) => r.length))}, minmax(0, 1fr))` }}>
          {g.cells.flatMap((row, r) =>
            row.map((c, k) => (
              <div key={`${r}-${k}`} className={`flex min-h-14 items-center justify-center rounded-lg border-2 px-1 py-2 text-center text-sm font-bold ${/^(Room|Gallery|Hall|Office)\b/i.test(c) ? 'border-indigo-300 bg-indigo-50 text-indigo-800' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
                {c}
              </div>
            )),
          )}
        </div>
      )}
    </div>
  )
}
