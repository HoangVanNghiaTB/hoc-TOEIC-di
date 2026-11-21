import { useMemo, useState } from 'react'
import UnitView from './UnitView'
import { buildPracticeUnits, PART_NAME, recordUnit } from '../lib/units'
import { addXp } from '../lib/store'
import { sfx } from '../lib/audio'
import { part1Count, PART1_MIN } from '../lib/part1'

type Kind = 'p1' | 'p3' | 'p4' | 'p6' | 'p7'

export default function Practice({ kind, goBack }: { kind: Kind; goBack: () => void }) {
  const part = Number(kind.slice(1))
  const listening = part <= 4
  const [started, setStarted] = useState(false)
  const [rate, setRate] = useState(0.95)
  const [units, setUnits] = useState(() => buildPracticeUnits(kind))
  const [i, setI] = useState(0)
  const [right, setRight] = useState(0)
  const [total, setTotal] = useState(0)
  const [over, setOver] = useState(false)
  const bonus = useMemo(() => (total > 0 && right / total >= 0.8 ? 10 : 0), [right, total])

  function start() {
    setUnits(buildPracticeUnits(kind))
    setI(0)
    setRight(0)
    setTotal(0)
    setOver(false)
    setStarted(true)
  }

  if (kind === 'p1' && part1Count() === 0)
    return (
      <div className="space-y-3 rounded-3xl bg-white p-5 shadow">
        <h2 className="text-lg font-extrabold">🖼️ Part 1 · Tranh ảnh</h2>
        <p className="text-sm text-slate-600">Chưa có ảnh nào. Part 1 cần ảnh do bạn tự thêm (ảnh của bạn hoặc ảnh miễn phí bản quyền).</p>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-600">
          <li>Chép ảnh vào thư mục <code>public/photos/</code> trong dự án.</li>
          <li>Tạo file <code>public/photos/part1.json</code> theo mẫu <code>part1.example.json</code> (mỗi ảnh có 4 câu mô tả A–D, đáp án đúng và giải thích).</li>
          <li>Tải lại trang. Cần ít nhất {PART1_MIN} ảnh thì Part 1 mới được đưa vào kế hoạch học và điều kiện điểm.</li>
        </ol>
        <p className="text-xs text-slate-400">Chi tiết: docs/PART1_HUONG_DAN.md. Bạn cũng có thể gửi ảnh cho tôi để tôi viết sẵn 4 câu mô tả.</p>
        <button onClick={goBack} className="rounded-2xl bg-slate-200 px-5 py-2 font-bold">Quay lại</button>
      </div>
    )

  if (!started) {
    return (
      <div className="space-y-3">
        <div className="rounded-3xl bg-white p-5 shadow">
          <h2 className="text-lg font-extrabold">{PART_NAME[part]}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {kind === 'p1'
              ? 'Nhìn ảnh, nghe 4 câu mô tả (A–D, không in chữ) rồi chọn câu mô tả đúng nhất. Chữ chỉ hiện sau khi bạn nộp bài.'
              : listening
              ? 'Nghe rồi trả lời các câu hỏi. Câu hỏi và đáp án hiện sẵn, nội dung chữ chỉ hiện sau khi bạn nộp bài.'
              : 'Đọc đoạn văn rồi trả lời. Có giải thích và bản dịch tóm tắt sau mỗi bài.'}{' '}
            Mỗi lượt {kind === 'p1' ? 6 : 3} bài.
          </p>
          {listening && (
            <>
              <p className="mt-3 text-xs text-slate-400">Giọng đọc là giọng máy của trình duyệt (hai giọng cho hội thoại nếu máy có).</p>
              <div className="mt-2 flex gap-2 text-sm">
                {[0.8, 0.95, 1.1].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRate(r)}
                    className={`rounded-full px-3 py-1 ${rate === r ? 'bg-indigo-100 font-bold text-indigo-700' : 'bg-slate-100 text-slate-500'}`}
                  >
                    {r === 0.8 ? 'Chậm' : r === 0.95 ? 'Vừa' : 'Nhanh'}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <button onClick={start} className="w-full rounded-2xl bg-indigo-600 py-4 font-bold text-white shadow">
          Bắt đầu
        </button>
      </div>
    )
  }

  if (over) {
    return (
      <div className="pop rounded-3xl bg-white p-8 text-center shadow">
        <div className="text-6xl">{right === total ? '🏆' : '🎉'}</div>
        <h2 className="mt-3 text-xl font-extrabold">Hoàn thành!</h2>
        <p className="mt-2 text-3xl font-extrabold text-indigo-600">
          {right}/{total}
        </p>
        <p className="text-slate-600">+{right * 3 + bonus} XP{bonus ? ' (thưởng ≥80%)' : ''}</p>
        <div className="mt-5 flex justify-center gap-3">
          <button onClick={start} className="rounded-2xl bg-indigo-600 px-6 py-3 font-bold text-white">
            Chơi lại
          </button>
          <button onClick={goBack} className="rounded-2xl bg-slate-200 px-6 py-3 font-bold">
            Quay lại
          </button>
        </div>
      </div>
    )
  }

  const unit = units[i]
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm shadow">
        <span className="font-bold text-indigo-700">
          Bài {i + 1}/{units.length}
        </span>
        <span className="font-bold">
          ✔ {right}/{total}
        </span>
      </div>
      <UnitView
        key={unit.id}
        unit={unit}
        mode="practice"
        rate={rate}
        nextLabel={i + 1 >= units.length ? 'Xem kết quả' : 'Bài tiếp theo'}
        onSubmit={(picks) => {
          recordUnit(unit, picks)
          const ok = unit.qs.filter((q, k) => picks[k] === q.a).length
          setRight((r) => r + ok)
          setTotal((t) => t + unit.qs.length)
          if (ok === unit.qs.length) sfx.good()
          else sfx.bad()
        }}
        onNext={() => {
          if (i + 1 >= units.length) {
            if (bonus) addXp(bonus)
            sfx.win()
            setOver(true)
          } else setI(i + 1)
        }}
      />
    </div>
  )
}
