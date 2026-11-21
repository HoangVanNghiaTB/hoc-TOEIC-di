import { useState } from 'react'
import type { Tab } from '../App'
import { PASS_RATE, nextSession, sessionKey, setSettings, togglePlanTask, useStore } from '../lib/store'
import { expectedSession, gateStatus, planFor, sessionPreview } from '../lib/plan'
import { PHASES, daysToExam, weekRange } from '../lib/roadmap'
import { ProgressBar } from '../components/ui/Progress'
import { Panel, SectionHeading, StatusBadge } from '../components/ui/Cards'
import { PrimaryButton } from '../components/ui/Buttons'

/** Mission Board: mỗi buổi học là một nhiệm vụ lớn, mỗi mục là nhiệm vụ con. Logic giữ nguyên, chỉ đổi giao diện. */
export default function Plan({ go }: { go: (t: Tab, p?: string) => void }) {
  const s = useStore()
  const [showNext, setShowNext] = useState(false)
  const n = s.sessionNo
  const key = sessionKey(n)
  const plan = planFor(n, s.settings.newPerDay, s.settings.planMin)
  const done = s.planDone[key] ?? []
  const finished = !!s.sessionDone[String(n)]
  const total = plan.tasks.reduce((a, t) => a + t.min, 0)
  const doneMin = plan.tasks.filter((t) => done.includes(t.id)).reduce((a, t) => a + t.min, 0)
  const doneCount = plan.tasks.filter((t) => done.includes(t.id)).length
  const allIds = plan.tasks.map((t) => t.id)
  const next = plan.tasks.find((t) => !done.includes(t.id))
  const phase = PHASES.find((p) => p.name === plan.phase)
  const expected = expectedSession()
  const gap = n - expected
  const checkMin = total - plan.baseMin

  return (
    <div className="space-y-5">
      {/* ===== Header nhiệm vụ ===== */}
      <section className="clip-corner hero-grid relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-[#2a1710] via-[#172131] to-[#101722] p-6 shadow-lg">
        <div className="relative grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="text-xs font-bold tracking-[0.3em] text-indigo-400">
              MISSION · TUẦN {plan.week}/14 · {weekRange(plan.week)}
            </div>
            <h1 className="font-display mt-1 text-3xl font-bold text-slate-900 sm:text-4xl">SESSION {String(n).padStart(3, '0')}</h1>
            <p className="mt-1 text-sm text-slate-500">
              Giai đoạn “{plan.phase}”: {phase?.focus}
              {checkMin > 0 && ` · gồm ${checkMin} phút kiểm tra`}
            </p>
            <div className="mt-4 max-w-lg">
              <div className="mb-1.5 flex justify-between text-xs font-bold tracking-wider text-slate-500 uppercase">
                <span>
                  {doneCount}/{plan.tasks.length} mục hoàn thành
                </span>
                <span>
                  {doneMin}/{total} phút
                </span>
              </div>
              <ProgressBar value={(doneMin / total) * 100} height="h-3" label="Tiến độ buổi học" />
            </div>
          </div>
          <div className="space-y-2 text-sm lg:w-72">
            <div className="flex flex-wrap gap-2">
              {([60, 90] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setSettings({ planMin: m })}
                  aria-pressed={s.settings.planMin === m}
                  className={`rounded-xl border px-3 py-1.5 text-xs font-bold ${s.settings.planMin === m ? 'border-indigo-500 bg-indigo-100 text-indigo-700' : 'border-slate-200 bg-slate-50 text-slate-500'}`}
                >
                  {m === 60 ? 'Chỉ học (60’ cơ bản)' : 'Có game (90’ cơ bản)'}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge tone="muted">còn {daysToExam()} ngày đến kỳ thi</StatusBadge>
              {gap === 0 && <StatusBadge tone="success">✔ Đúng tiến độ</StatusBadge>}
              {gap > 0 && <StatusBadge tone="success">▲ Đi trước {gap} buổi</StatusBadge>}
              {gap < 0 && <StatusBadge tone="warning">▼ Chậm {-gap} buổi</StatusBadge>}
            </div>
            <p className="text-xs text-slate-400">
              {gap < 0
                ? `Theo lịch (1 buổi/ngày) hôm nay là buổi ${expected}. Buổi sau chỉ mở khi xong buổi này, bạn có thể học 2 buổi trong một ngày để bắt kịp.`
                : 'Hoàn thành cả buổi: +30 XP. Buổi sau chỉ mở khi buổi này hoàn thành.'}
            </p>
          </div>
        </div>
      </section>

      {finished && (
        <div className="pop flex flex-col items-start justify-between gap-3 rounded-3xl border border-emerald-500/50 bg-emerald-50 p-5 sm:flex-row sm:items-center">
          <div>
            <div className="font-display text-xl font-bold text-slate-900">🎉 Hoàn thành buổi {n}! +30 XP</div>
            <p className="text-sm text-slate-500">Buổi {n + 1} đã mở. Học tiếp ngay hoặc nghỉ rồi quay lại sau.</p>
          </div>
          <PrimaryButton onClick={() => nextSession()}>Sang buổi {n + 1} →</PrimaryButton>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
        {/* ===== Danh sách nhiệm vụ ===== */}
        <div className="space-y-3">
          {plan.tasks.map((t, i) => {
            const ok = done.includes(t.id)
            const isNext = next?.id === t.id
            const gate = t.gate ? gateStatus(s.sessionAnswers[String(n)]?.[t.gate.stat], t.gate.need) : null
            const isCheck = t.id === 'vcheck' || t.id === 'rcheck' || !!t.gate
            const best = s.checkBest[`${key}:${t.id}`]
            return (
              <div
                key={t.id}
                className={`rounded-3xl border bg-white p-4 shadow ${isNext ? 'border-indigo-500 ring-1 ring-indigo-500/40' : 'border-transparent'} ${ok ? 'opacity-70' : ''}`}
              >
                <div className="flex items-start gap-3">
                  {isCheck ? (
                    <span
                      role="img"
                      aria-label={ok ? 'Đã hoàn thành' : 'Bị khóa, cần đạt điểm tối thiểu'}
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${ok ? 'bg-emerald-500 text-white' : 'border border-slate-300 bg-slate-100'}`}
                    >
                      {ok ? '✓' : '🔒'}
                    </span>
                  ) : (
                    <button
                      onClick={() => togglePlanTask(key, t.id, allIds)}
                      aria-label={ok ? 'Bỏ đánh dấu hoàn thành' : 'Đánh dấu đã xong'}
                      aria-pressed={ok}
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 text-sm font-bold ${ok ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 hover:border-indigo-400'}`}
                    >
                      {ok ? '✓' : ''}
                    </button>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className={`text-base font-bold ${ok ? 'line-through' : ''}`}>
                        <span className="text-slate-400">{String(i + 1).padStart(2, '0')}</span> <span aria-hidden>{t.icon}</span> {t.title}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {isCheck && <StatusBadge tone={ok ? 'success' : 'warning'}>{ok ? '✔ Đạt' : `🔒 Cần ≥ ${PASS_RATE * 100}%`}</StatusBadge>}
                        <StatusBadge tone="accent">{t.min} phút</StatusBadge>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{t.how}</p>
                    <p className="mt-1.5 rounded-xl bg-emerald-50 px-2.5 py-1.5 text-xs text-emerald-800">✅ Tự kiểm tra: {t.check}</p>
                    {isCheck && (
                      <div className="mt-2">
                        {gate && (
                          <>
                            <div className="mb-1 flex justify-between text-[11px] font-bold text-slate-500">
                              <span>
                                Đã làm {gate.done}/{gate.need} câu · đúng {gate.ok}/{gate.done >= gate.need ? gate.need : gate.done}
                              </span>
                              {gate.done >= gate.need && !gate.pass && <span className="text-amber-400">Chưa đạt, làm thêm lượt khác</span>}
                            </div>
                            <ProgressBar value={(gate.done / gate.need) * 100} tone={gate.pass ? 'success' : 'warning'} height="h-1.5" label="Số câu đã làm" />
                          </>
                        )}
                        {!gate && best !== undefined && <div className="text-xs font-bold text-slate-500">Điểm tốt nhất: {Math.round(best * 100)}%</div>}
                      </div>
                    )}
                    {!ok && (
                      <PrimaryButton onClick={() => go(t.go, t.param)} className={`mt-3 px-4 py-2 text-sm ${isNext ? '' : '!bg-slate-100 !text-slate-800 hover:!bg-slate-200'}`}>
                        {isNext ? 'Bắt đầu ngay →' : 'Mở →'}
                      </PrimaryButton>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          <p className="px-1 text-xs text-slate-400">
            Mục có 🔒 (kiểm tra từ vựng, nghe, chép chính tả, podcast, Part 2–7) chỉ tự đánh dấu khi bạn đạt từ {PASS_RATE * 100}%; không thể tick tay. Từ buổi 2 có thêm bước kiểm tra lại các buổi trước nên thời gian dài hơn.
          </p>
        </div>

        {/* ===== Cột phụ: xem trước ===== */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Panel>
            <SectionHeading title="7 buổi sắp tới" />
            <button onClick={() => setShowNext((v) => !v)} className="mb-3 w-full rounded-xl border border-slate-200 bg-slate-50 py-2 text-xs font-bold text-indigo-700 lg:hidden">
              {showNext ? 'Ẩn' : 'Xem'}
            </button>
            <div className={`${showNext ? 'block' : 'hidden'} space-y-2 lg:block`}>
              {sessionPreview(n, s.settings.newPerDay, s.settings.planMin).map(({ n: k, tasks }) => (
                <div key={k} className={`rounded-xl border p-2.5 text-xs ${k === n ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex items-center justify-between font-bold">
                    <span>Buổi {k}</span>
                    {k === n ? <StatusBadge tone="accent">▶ Hiện tại</StatusBadge> : <span className="text-slate-400">🔒</span>}
                  </div>
                  <div className="mt-1 leading-relaxed text-slate-500">{tasks.map((t) => `${t.icon} ${t.title} ${t.min}’`).join(' · ')}</div>
                </div>
              ))}
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  )
}
