import { WORDS } from '../data/words'
import { dueWords, newWords, isLearned, isMastered } from '../lib/srs'
import { BADGES, PHASES, WORD_TARGET, daysToExam, phaseOf, weekOf, weekRange } from '../lib/roadmap'
import { sessionKey, levelOf, liveStreak, titleOf, useStore, xpForLevel } from '../lib/store'
import type { Tab } from '../App'
import { TOTAL_SESSIONS, expectedSession, planFor } from '../lib/plan'
import ProgressChart from './ProgressChart'
import { ProgressBar } from '../components/ui/Progress'
import { Panel, SectionHeading, StatCard, StatusBadge } from '../components/ui/Cards'
import { PrimaryButton, SecondaryButton } from '../components/ui/Buttons'

export default function Home({ go }: { go: (t: Tab, p?: string) => void }) {
  const s = useStore()
  const level = levelOf(s.xp)
  const lo = xpForLevel(level)
  const hi = xpForLevel(level + 1)
  const xpPct = ((s.xp - lo) / (hi - lo)) * 100

  const due = dueWords(s, WORDS).length
  const fresh = newWords(s, WORDS).length
  const cards = Object.values(s.cards)
  const learned = cards.filter(isLearned).length
  const mastered = cards.filter(isMastered).length

  const today = s.daily.date === new Date().toLocaleDateString('sv-SE') ? s.daily : { reviewed: 0, xp: 0, newLearned: 0 }
  const goalPct = Math.min(100, (today.reviewed / s.settings.dailyGoal) * 100)

  const calWeek = weekOf()
  const target = WORD_TARGET[calWeek - 1]
  const plan = planFor(s.sessionNo, s.settings.newPerDay, s.settings.planMin)
  const phase = phaseOf(plan.week)
  const done = s.planDone[sessionKey(s.sessionNo)] ?? []
  const total = plan.tasks.reduce((a, t) => a + t.min, 0)
  const doneMin = plan.tasks.filter((t) => done.includes(t.id)).reduce((a, t) => a + t.min, 0)
  const next = plan.tasks.find((t) => !done.includes(t.id))
  const finished = !!s.sessionDone[String(s.sessionNo)]
  const completedSessions = Object.keys(s.sessionDone).length
  const courseDone = Math.round((completedSessions / TOTAL_SESSIONS) * 100)
  const gap = s.sessionNo - expectedSession()
  const earned = BADGES.filter((b) => b.check(s))

  return (
    <div className="space-y-5">
      {/* ================= HERO ================= */}
      <section className="clip-corner hero-grid relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-[#2a1710] via-[#172131] to-[#101722] p-6 shadow-lg sm:p-8">
        <div className="pointer-events-none absolute -top-24 -right-20 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" aria-hidden />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="text-xs font-bold tracking-[0.3em] text-indigo-400">TRAIN. PROGRESS. CONQUER 600+.</div>
            <h1 className="font-display mt-2 text-3xl leading-tight font-bold text-slate-900 sm:text-5xl">ROAD TO TOEIC 600+</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <StatusBadge tone="accent">Buổi {s.sessionNo}</StatusBadge>
              <StatusBadge tone="info">Tuần {plan.week}/14</StatusBadge>
              <StatusBadge tone="muted">Giai đoạn {phase.name}</StatusBadge>
              {gap === 0 && <StatusBadge tone="success">✔ Đúng tiến độ</StatusBadge>}
              {gap > 0 && <StatusBadge tone="success">▲ Đi trước {gap} buổi</StatusBadge>}
              {gap < 0 && <StatusBadge tone="warning">▼ Chậm {-gap} buổi</StatusBadge>}
            </div>
            <div className="mt-5 max-w-xl">
              <div className="mb-1.5 flex justify-between text-xs font-bold tracking-wider text-slate-500 uppercase">
                <span>Hành trình {TOTAL_SESSIONS} buổi</span>
                <span>
                  {completedSessions}/{TOTAL_SESSIONS} buổi · {courseDone}%
                </span>
              </div>
              <ProgressBar value={courseDone} height="h-3" label="Tiến độ toàn lộ trình" />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <PrimaryButton onClick={() => go('plan')} className="px-7 py-3.5 text-base tracking-wide uppercase">
                {finished ? 'Sang buổi tiếp theo →' : doneMin > 0 ? 'Tiếp tục buổi học →' : 'Bắt đầu buổi học →'}
              </PrimaryButton>
              <SecondaryButton onClick={() => go('progress')}>📊 Xem tiến độ</SecondaryButton>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center lg:w-64 lg:grid-cols-1">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <div className="font-display text-4xl font-bold text-indigo-400">{daysToExam()}</div>
              <div className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">ngày đến kỳ thi 25/02</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <div className="font-display text-2xl font-bold text-slate-900">{phase.target}</div>
              <div className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">mốc điểm giai đoạn này</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STAT CARDS ================= */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon="⭐" label="Cấp độ" value={`Cấp ${level}`} note={`${titleOf(level)} · ${s.xp}/${hi} XP`} tone="accent">
          <ProgressBar value={xpPct} label="Tiến độ lên cấp" />
        </StatCard>
        <StatCard icon="🔥" label="Streak" value={liveStreak(s)} note="ngày liên tiếp" />
        <button onClick={() => go('learn')} className="text-left">
          <StatCard icon="🃏" label="Thẻ SRS" value={due} note={`đến hạn ôn · ${fresh} từ mới có thể học`} tone={due > 0 ? 'accent' : 'default'} />
        </button>
        <StatCard icon="🎯" label="Mục tiêu thẻ hôm nay" value={`${today.reviewed}/${s.settings.dailyGoal}`} tone={goalPct >= 100 ? 'success' : 'default'}>
          <ProgressBar value={goalPct} tone="success" label="Mục tiêu thẻ ngày" />
        </StatCard>
      </div>

      {/* ================= MISSION + ROADMAP ================= */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel>
          <SectionHeading
            title={`Nhiệm vụ · Buổi ${s.sessionNo}`}
            sub={`${doneMin}/${total} phút · ${plan.tasks.filter((t) => done.includes(t.id)).length}/${plan.tasks.length} mục`}
            right={finished ? <StatusBadge tone="success">✔ Hoàn thành</StatusBadge> : undefined}
          />
          <ProgressBar value={(doneMin / total) * 100} label="Tiến độ buổi học" />
          <ul className="mt-4 space-y-2">
            {plan.tasks.map((t) => {
              const ok = done.includes(t.id)
              const isNext = next?.id === t.id
              const locked = t.id === 'vcheck' || t.id === 'rcheck' || !!t.gate
              return (
                <li key={t.id}>
                  <button
                    onClick={() => go(t.go, t.param)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition hover:border-indigo-400 ${isNext ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-slate-50'} ${ok ? 'opacity-60' : ''}`}
                  >
                    <span className="text-xl" aria-hidden>{t.icon}</span>
                    <span className="min-w-0 flex-1">
                      <span className={`block truncate text-sm font-bold ${ok ? 'line-through' : ''}`}>{t.title}</span>
                      <span className="block text-[11px] text-slate-400">
                        {t.min} phút{locked && !ok ? ' · cần ≥ 70%' : ''}
                      </span>
                    </span>
                    <StatusBadge tone={ok ? 'success' : isNext ? 'accent' : 'muted'}>{ok ? '✔ Xong' : isNext ? '▶ Tiếp theo' : locked ? '🔒 Chưa đạt' : 'Chờ'}</StatusBadge>
                  </button>
                </li>
              )
            })}
          </ul>
          <PrimaryButton onClick={() => go('plan')} className="mt-4 w-full">
            Mở bảng nhiệm vụ đầy đủ →
          </PrimaryButton>
        </Panel>

        <Panel>
          <SectionHeading title={`Lộ trình ${TOTAL_SESSIONS} buổi`} sub={`Tuần ${plan.week}/14 (theo buổi học) · lịch gốc tuần ${calWeek}: ${weekRange(calWeek)}`} />
          <div className="space-y-2.5">
            {PHASES.map((p, i) => {
              const state = plan.week > p.to ? 'done' : plan.week >= p.from ? 'now' : 'next'
              return (
                <div key={p.name} className={`rounded-xl border p-3 ${state === 'now' ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-bold">
                      {i + 1}. {p.name} <span className="font-normal text-slate-400">· tuần {p.from === p.to ? p.from : `${p.from}–${p.to}`}</span>
                    </div>
                    <StatusBadge tone={state === 'done' ? 'success' : state === 'now' ? 'accent' : 'muted'}>
                      {state === 'done' ? '✔ Đã qua' : state === 'now' ? '▶ Đang học' : '🔒 Sắp tới'}
                    </StatusBadge>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">{p.focus}</div>
                  <div className="mt-1 text-xs font-bold text-indigo-400">Mốc điểm: {p.target}</div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 flex gap-1" aria-label="14 tuần">
            {Array.from({ length: 14 }, (_, i) => (
              <div key={i} title={`Tuần ${i + 1}`} className={`h-2.5 flex-1 rounded-full ${i + 1 < plan.week ? 'bg-indigo-500' : i + 1 === plan.week ? 'bg-amber-400' : 'bg-slate-200'}`} />
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <Mini label="Đã học" value={learned} />
            <Mini label="Đã thuộc" value={mastered} />
            <Mini label={`Mục tiêu từ (lịch tuần ${calWeek})`} value={target} />
          </div>
          {learned < target && <p className="mt-2 text-[11px] text-slate-400">Kho từ hiện có {WORDS.length} từ, sẽ bổ sung theo từng đợt.</p>}
        </Panel>
      </div>

      {/* ================= CHART + BADGES ================= */}
      <div className="grid gap-5 lg:grid-cols-2">
        <ProgressChart />
        <Panel>
          <SectionHeading
            title="Huy hiệu"
            sub={`Đã đạt ${earned.length}/${BADGES.length}`}
            right={<StatusBadge tone={earned.length ? 'accent' : 'muted'}>🏅 {earned.length}</StatusBadge>}
          />
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {BADGES.map((b) => {
              const ok = b.check(s)
              return (
                <div
                  key={b.id}
                  title={`${b.name}: ${b.desc}`}
                  className={`flex aspect-square flex-col items-center justify-center rounded-xl border text-2xl ${ok ? 'border-amber-400/50 bg-yellow-100' : 'border-slate-200 bg-slate-50 opacity-40 grayscale'}`}
                >
                  <span aria-hidden>{b.icon}</span>
                  <span className="sr-only">{ok ? `Đã đạt: ${b.name}` : `Chưa đạt: ${b.name}`}</span>
                </div>
              )
            })}
          </div>
          <p className="mt-2 text-xs text-slate-400">Rê chuột hoặc chạm vào huy hiệu để xem điều kiện.</p>
        </Panel>
      </div>

      {/* ================= TRUY CẬP NHANH ================= */}
      <Panel>
        <SectionHeading title="Truy cập nhanh" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Quick icon="🃏" title="Học thẻ" sub={`${due} cần ôn · ${fresh} mới`} color="bg-indigo-600" onClick={() => go('learn')} />
          <Quick icon="📻" title="Radio" sub="Nghe thụ động" color="bg-amber-500" onClick={() => go('radio')} />
          <Quick icon="🧩" title="Ghép từ" sub={`Kỷ lục ${s.best.match}`} color="bg-pink-500" onClick={() => go('match')} />
          <Quick icon="⌨️" title="Nghe & gõ" sub={`Kỷ lục ${s.best.typing} từ`} color="bg-teal-500" onClick={() => go('typing')} />
          <Quick icon="✍️" title="Part 5" sub="Luyện ngữ pháp" color="bg-sky-500" onClick={() => go('quiz')} />
          <Quick icon="📕" title="Sổ lỗi sai" sub={`${Object.keys(s.mistakes).length} câu cần ôn`} color="bg-rose-500" onClick={() => go('review')} />
        </div>
      </Panel>
    </div>
  )
}

function Mini({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
      <div className="font-display text-xl font-bold text-indigo-400">{value}</div>
      <div className="text-[11px] leading-tight text-slate-500">{label}</div>
    </div>
  )
}

function Quick({ icon, title, sub, color, onClick }: { icon: string; title: string; sub: string; color: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`rounded-2xl ${color} px-4 py-4 text-left text-white shadow transition hover:brightness-110 active:scale-95`}>
      <div className="text-2xl" aria-hidden>{icon}</div>
      <div className="font-bold">{title}</div>
      <div className="text-xs opacity-85">{sub}</div>
    </button>
  )
}
