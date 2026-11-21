import { useEffect, useRef, useState } from 'react'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { onPersistStatus, persistStatus, saveNow } from '../lib/persist'
import { exportJson, importJson, resetAll, setSettings, toggleFlag, useStore } from '../lib/store'
import { WORDS } from '../data/words'
import { QUESTIONS } from '../data/questions'
import { P2_QUESTIONS } from '../data/listening'

function describe(key: string): string {
  const [kind, id] = [key.slice(0, 1), key.slice(2)]
  if (kind === 'w') {
    const w = WORDS.find((x) => x.id === id)
    return w ? `Từ: ${w.en} ${w.ipa} (${w.pos}) = ${w.vi}` : key
  }
  if (kind === 'q') {
    const q = QUESTIONS.find((x) => x.id === id)
    return q ? `Part 5 [${q.tag}]: ${q.q} | đáp án: ${q.opts[q.a]}` : key
  }
  if (kind === 'p') return `Podcast ${id}: lời chép có thể sai`
  const l = P2_QUESTIONS.find((x) => x.id === id)
  return l ? `Part 2: ${l.q} | đáp án: ${l.r[0]}` : key
}

export default function Settings() {
  const s = useStore()
  const fileRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState('')
  const [confirmReset, setConfirmReset] = useState(false)
  const [ps, setPs] = useState(persistStatus())
  useEffect(() => onPersistStatus(() => setPs({ ...persistStatus() })), [])

  function download() {
    const blob = new Blob([exportJson()], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `toeic-quest-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
    setMsg('Đã xuất file sao lưu.')
  }

  const flagged = Object.keys(s.flags)

  async function copyFlags() {
    const text = flagged.map(describe).join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setMsg('Đã sao chép danh sách báo sai.')
    } catch {
      setMsg('Không sao chép được, hãy chép tay từ danh sách.')
    }
  }

  async function upload(f: File | undefined) {
    if (!f) return
    const ok = importJson(await f.text())
    setMsg(ok ? 'Đã nhập tiến độ thành công.' : 'File không hợp lệ.')
  }

  return (
    <div className="space-y-4">
      <section className="space-y-4 rounded-3xl bg-white p-5 shadow">
        <h2 className="font-bold">⚙️ Mục tiêu học</h2>
        <label className="flex items-center justify-between text-sm">
          <span>Từ mới mỗi ngày: <b>{s.settings.newPerDay}</b></span>
          <input type="range" min={5} max={40} step={5} value={s.settings.newPerDay} onChange={(e) => setSettings({ newPerDay: Number(e.target.value) })} />
        </label>
        <label className="flex items-center justify-between text-sm">
          <span>Mục tiêu thẻ mỗi ngày: <b>{s.settings.dailyGoal}</b></span>
          <input type="range" min={10} max={100} step={5} value={s.settings.dailyGoal} onChange={(e) => setSettings({ dailyGoal: Number(e.target.value) })} />
        </label>
      </section>

      <section className="space-y-3 rounded-3xl bg-white p-5 shadow">
        <h2 className="font-bold">💾 Sao lưu tiến độ</h2>
        <p className="text-sm text-slate-500">
          Tiến độ được lưu trong trình duyệt này. Xóa dữ liệu trình duyệt sẽ mất tiến độ, nên hãy xuất file sao lưu mỗi tuần.
        </p>
        <div className="flex flex-wrap gap-2">
          <button onClick={download} className="rounded-2xl bg-indigo-600 px-4 py-2 font-bold text-white">
            Xuất file
          </button>
          <button onClick={() => fileRef.current?.click()} className="rounded-2xl bg-slate-200 px-4 py-2 font-bold">
            Nhập file
          </button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={(e) => void upload(e.target.files?.[0])} />
        </div>
        {msg && <p className="text-sm text-emerald-600">{msg}</p>}
        <div className="rounded-2xl bg-slate-50 p-3 text-sm">
          <b>Tự lưu ra file:</b>{' '}
          {ps.state === 'off' && <span className="text-slate-500">chưa bật (chỉ hoạt động khi chạy bằng npm run dev / start.bat).</span>}
          {ps.state === 'ok' && (
            <span className="text-emerald-700">
              đang bật, lưu vào thư mục <code>progress/progress.json</code> trong dự án
              {ps.at ? ` · lần ghi gần nhất ${new Date(ps.at).toLocaleTimeString('vi-VN')}` : ''}
              {ps.restored ? ' · đã nạp lại từ file khi mở web' : ''}.
            </span>
          )}
          {ps.state === 'error' && <span className="text-rose-600">{ps.msg}</span>}
          {ps.state !== 'off' && (
            <button onClick={saveNow} className="ml-2 rounded-xl bg-indigo-100 px-2 py-1 text-xs font-bold text-indigo-700">Lưu ngay</button>
          )}
        </div>
      </section>

      <section className="space-y-3 rounded-3xl bg-white p-5 shadow">
        <h2 className="font-bold">🚩 Mục đã báo sai ({flagged.length})</h2>
        {flagged.length === 0 ? (
          <p className="text-sm text-slate-500">
            Chưa có mục nào. Khi thấy từ hoặc câu hỏi nghi sai, bấm “Báo sai” để gom về đây, rồi gửi danh sách cho tôi sửa.
          </p>
        ) : (
          <>
            <ul className="max-h-60 space-y-2 overflow-auto text-sm">
              {flagged.map((k) => (
                <li key={k} className="flex items-start justify-between gap-2 rounded-xl bg-slate-50 p-2">
                  <span>{describe(k)}</span>
                  <button onClick={() => toggleFlag(k)} className="shrink-0 text-xs text-rose-500">
                    Bỏ
                  </button>
                </li>
              ))}
            </ul>
            <button onClick={copyFlags} className="rounded-2xl bg-indigo-600 px-4 py-2 font-bold text-white">
              Sao chép danh sách
            </button>
          </>
        )}
      </section>

      <section className="rounded-3xl bg-white p-5 shadow">
        <h2 className="font-bold text-rose-600">Xóa toàn bộ tiến độ</h2>
        <button
          onClick={() => setConfirmReset(true)}
          className="mt-2 rounded-2xl bg-rose-100 px-4 py-2 font-bold text-rose-600"
        >
          Xóa tất cả
        </button>
      </section>
      <ConfirmDialog
        open={confirmReset}
        title="Xóa toàn bộ tiến độ?"
        message="Mọi thẻ, XP, buổi học, ghi chú và kết quả sẽ bị xóa khỏi trình duyệt. Máy chủ sẽ giữ lại bản sao trong progress/backups nếu dữ liệu giảm mạnh, nhưng bạn không nên dựa vào đó. Hành động này không thể hoàn tác."
        confirmLabel="Xóa tất cả"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          setConfirmReset(false)
          resetAll()
        }}
      />
    </div>
  )
}
