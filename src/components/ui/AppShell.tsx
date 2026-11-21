import { useState } from 'react'
import type { ReactNode } from 'react'
import { levelOf, liveStreak, titleOf, useStore, xpForLevel } from '../../lib/store'
import { ProgressBar } from './Progress'

export type NavGroup = 'home' | 'learn' | 'games' | 'grammar' | 'lab' | 'teacher' | 'notes' | 'settings'

export const NAV: { id: NavGroup; icon: string; label: string; hint: string }[] = [
  { id: 'home', icon: '🏠', label: 'Trang chủ', hint: 'Buổi học & tiến độ' },
  { id: 'learn', icon: '🃏', label: 'Học thẻ', hint: 'Từ vựng SRS' },
  { id: 'games', icon: '🎮', label: 'Trò chơi', hint: 'Game, nghe, podcast' },
  { id: 'grammar', icon: '📘', label: 'Ngữ pháp', hint: 'Bài học, Part 5' },
  { id: 'lab', icon: '📝', label: 'Luyện đề', hint: 'Part 1–7, thi thử' },
  { id: 'notes', icon: '🗒️', label: 'Ghi chú', hint: 'Kho kiến thức' },
]

const TITLES: Record<string, string> = {
  home: 'Trang chủ', plan: 'Kế hoạch buổi học', progress: 'Tiến độ', check: 'Kiểm tra từ vựng',
  learn: 'Học thẻ', games: 'Trò chơi', match: 'Ghép từ', typing: 'Nghe & gõ', order: 'Sắp xếp câu',
  dictation: 'Chép chính tả', listen: 'Part 2 · Hỏi–Đáp', podcast: 'Podcast', radio: 'Radio',
  grammar: 'Ngữ pháp', lessons: 'Bài ngữ pháp', quiz: 'Part 5 · Điền câu', review: 'Sổ lỗi sai',
  lab: 'Luyện đề', practice: 'Luyện theo Part', mock: 'Thi thử rút gọn', notes: 'Ghi chú',
  teacher: 'Giáo viên AI', settings: 'Cài đặt',
}

const COLLAPSE_KEY = 'tq-sidebar-collapsed'
const readCollapsed = () => {
  try {
    return localStorage.getItem(COLLAPSE_KEY) === '1'
  } catch {
    return false
  }
}

/** Khung ứng dụng: sidebar + topbar (desktop), thanh điều hướng dưới (mobile). Không chứa logic nghiệp vụ. */
export default function AppShell({
  tab,
  group,
  go,
  back,
  wide,
  children,
}: {
  tab: string
  group: NavGroup
  go: (t: NavGroup | 'teacher' | 'settings') => void
  back: () => void
  wide: boolean
  children: ReactNode
}) {
  const s = useStore()
  const [collapsed, setCollapsed] = useState(readCollapsed)
  const level = levelOf(s.xp)
  const lo = xpForLevel(level)
  const hi = xpForLevel(level + 1)
  const pct = ((s.xp - lo) / (hi - lo)) * 100
  const streak = liveStreak(s)

  function toggle() {
    setCollapsed((c) => {
      try {
        localStorage.setItem(COLLAPSE_KEY, c ? '0' : '1')
      } catch {
        /* bỏ qua */
      }
      return !c
    })
  }

  return (
    <div className={`min-h-screen ${collapsed ? 'lg:pl-[76px]' : 'lg:pl-64'}`}>
      {/* ===== Sidebar (desktop) ===== */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-slate-200 bg-[#101722] lg:flex ${collapsed ? 'w-[76px]' : 'w-64'}`}
        aria-label="Điều hướng chính"
      >
        <button onClick={() => go('home')} className="flex h-16 items-center gap-3 border-b border-slate-200 px-4 text-left">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-xl shadow-lg">🎯</span>
          {!collapsed && (
            <span>
              <span className="font-display block text-lg leading-none font-bold text-slate-900">TOEIC QUEST</span>
              <span className="text-[10px] font-bold tracking-[0.25em] text-indigo-400">ROAD TO 600+</span>
            </span>
          )}
        </button>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV.map((n) => {
            const active = group === n.id
            return (
              <button
                key={n.id}
                onClick={() => go(n.id)}
                aria-current={active ? 'page' : undefined}
                title={n.label}
                className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${active ? 'bg-indigo-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                {active && <span className="absolute top-2 bottom-2 left-0 w-1 rounded-r bg-indigo-500" />}
                <span className="text-xl" aria-hidden>{n.icon}</span>
                {!collapsed && (
                  <span className="min-w-0">
                    <span className="block text-sm font-bold">{n.label}</span>
                    <span className="block truncate text-[11px] text-slate-400">{n.hint}</span>
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {!collapsed && (
          <div className="m-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Cấp {level}</span>
              <span className="text-slate-400">{titleOf(level)}</span>
            </div>
            <div className="mt-2">
              <ProgressBar value={pct} label="Tiến độ lên cấp" />
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              {s.xp} / {hi} XP
            </div>
          </div>
        )}
        <button onClick={toggle} className="m-3 mt-0 rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-400 hover:text-slate-900" aria-label={collapsed ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng'}>
          {collapsed ? '»' : '« Thu gọn'}
        </button>
      </aside>

      {/* ===== Topbar ===== */}
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-[#101722]/90 px-4 backdrop-blur sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button onClick={() => go('home')} className="flex items-center gap-2 lg:hidden" aria-label="Về trang chủ">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-lg">🎯</span>
          </button>
          {tab !== group && (
            <button onClick={back} className="rounded-lg border border-slate-200 px-2.5 py-1 text-sm font-bold text-slate-500 hover:text-slate-900">
              ←<span className="hidden sm:inline"> Quay lại</span>
            </button>
          )}
          <div className="min-w-0">
            <div className="hidden text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase sm:block">{NAV.find((n) => n.id === group)?.label ?? 'TOEIC Quest'}</div>
            <div className="font-display truncate text-lg font-bold text-slate-900 sm:text-xl">{TITLES[tab] ?? 'TOEIC Quest'}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm font-bold">
          <span className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 sm:flex" title="XP và cấp độ">
            <span aria-hidden>⭐</span>
            <span>Cấp {level}</span>
            <span className="text-slate-400">·</span>
            <span className="text-indigo-400">{s.xp} XP</span>
          </span>
          <span className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5" title="Streak ngày liên tiếp">
            🔥 {streak}
          </span>
          <button onClick={() => go('teacher')} aria-label="Giáo viên AI" title="Giáo viên AI" className={`flex h-10 w-10 items-center justify-center rounded-xl border text-lg hover:border-indigo-400 ${tab === 'teacher' ? 'border-indigo-400 bg-indigo-100' : 'border-slate-200 bg-slate-50'}`}>
            🧑‍🏫
          </button>
          <button onClick={() => go('settings')} aria-label="Cài đặt" title="Cài đặt" className={`flex h-10 w-10 items-center justify-center rounded-xl border text-lg hover:border-indigo-400 ${tab === 'settings' ? 'border-indigo-400 bg-indigo-100' : 'border-slate-200 bg-slate-50'}`}>
            ⚙️
          </button>
        </div>
      </header>

      {/* ===== Nội dung ===== */}
      <main className={`mx-auto w-full px-4 pt-5 pb-28 sm:px-6 lg:px-8 lg:pb-10 ${wide ? 'max-w-6xl' : 'max-w-2xl'}`}>{children}</main>

      {/* ===== Thanh dưới (mobile / tablet) ===== */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-[#101722]/95 backdrop-blur lg:hidden" aria-label="Điều hướng chính">
        <div className="mx-auto flex max-w-2xl justify-around px-1 py-1.5">
          {NAV.map((n) => {
            const active = group === n.id
            return (
              <button
                key={n.id}
                onClick={() => go(n.id)}
                aria-current={active ? 'page' : undefined}
                className={`flex min-h-[48px] min-w-[52px] flex-1 flex-col items-center justify-center rounded-xl px-1 text-[11px] transition ${active ? 'bg-indigo-100 font-bold text-indigo-700' : 'text-slate-500'}`}
              >
                <span className="text-xl leading-none" aria-hidden>{n.icon}</span>
                <span className="mt-0.5">{n.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
