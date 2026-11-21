import { QUESTIONS } from '../data/questions'
import { LESSONS } from '../data/lessons'
import { grammarTotals, useStore } from '../lib/store'
import { part1Count } from '../lib/part1'
import type { Tab } from '../App'

type Go = (t: Tab, param?: string) => void

function Tile({ icon, title, sub, color, onClick }: { icon: string; title: string; sub: string; color: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col rounded-3xl border border-transparent bg-white p-4 text-left shadow transition hover:-translate-y-0.5 hover:border-indigo-400 active:scale-95"
    >
      <span className={`${color} flex h-11 w-11 items-center justify-center rounded-xl text-2xl text-white`} aria-hidden>
        {icon}
      </span>
      <span className="mt-3 font-bold text-slate-900">{title}</span>
      <span className="text-xs text-slate-500">{sub}</span>
      <span className="mt-3 text-[11px] font-bold tracking-wider text-indigo-400 uppercase group-hover:text-indigo-300">Bắt đầu →</span>
    </button>
  )
}

export function GamesHub({ go }: { go: Go }) {
  const s = useStore()
  return (
    <div className="space-y-3">
      <h2 className="font-display text-lg font-bold tracking-wide uppercase">🎧 Luyện nghe</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        <Tile icon="✍️" title="Chép chính tả" sub={`Đúng ${s.stats['l-dict']?.ok ?? 0}/${s.stats['l-dict']?.total ?? 0} câu`} color="bg-sky-500" onClick={() => go('dictation')} />
        <Tile icon="👂" title="Part 2 Hỏi–Đáp" sub={`Đúng ${s.stats['l-p2']?.ok ?? 0}/${s.stats['l-p2']?.total ?? 0} câu`} color="bg-indigo-500" onClick={() => go('listen')} />
        <Tile icon="🎙️" title="Podcast của tôi" sub={`${Object.keys(s.podcastDone).length} đoạn đã nghe`} color="bg-rose-500" onClick={() => go('podcast')} />
        <Tile icon="📻" title="Radio" sub="Nghe thụ động" color="bg-amber-500" onClick={() => go('radio')} />
      </div>
      <h2 className="font-display pt-3 text-lg font-bold tracking-wide uppercase">🎮 Trò chơi từ vựng</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        <Tile icon="🧩" title="Ghép từ" sub={`Kỷ lục ${s.best.match}`} color="bg-pink-500" onClick={() => go('match')} />
        <Tile icon="⌨️" title="Nghe & gõ" sub={`Kỷ lục ${s.best.typing} từ`} color="bg-teal-500" onClick={() => go('typing')} />
        <Tile icon="🧱" title="Sắp xếp câu" sub={`Kỷ lục ${s.best.order}/8`} color="bg-violet-500" onClick={() => go('order')} />
      </div>
    </div>
  )
}

export function GrammarHub({ go }: { go: Go }) {
  const s = useStore()
  const mistakeCount = Object.keys(s.mistakes).length
  const { ok, total } = grammarTotals(s)
  return (
    <div className="space-y-3">
      <h2 className="font-display text-lg font-bold tracking-wide uppercase">📘 Ngữ pháp & Part 5</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        <Tile icon="📖" title="Bài ngữ pháp" sub={`${s.lessons.length}/${LESSONS.length} bài`} color="bg-indigo-500" onClick={() => go('lessons')} />
        <Tile icon="✍️" title="Luyện Part 5" sub={`${QUESTIONS.length} câu, 5 ❤️`} color="bg-sky-500" onClick={() => go('quiz')} />
        <Tile
          icon="📕"
          title="Sổ lỗi sai"
          sub={mistakeCount ? `${mistakeCount} câu cần ôn` : 'Đang trống'}
          color="bg-rose-500"
          onClick={() => go('review')}
        />
      </div>
      <div className="rounded-3xl bg-white p-4 text-sm shadow">
        <div className="font-bold">Thống kê Part 5</div>
        <div className="mt-1 text-slate-500">
          {total ? `Đúng ${ok}/${total} câu (${Math.round((ok / total) * 100)}%)` : 'Chưa làm câu nào.'}
        </div>
      </div>
    </div>
  )
}

export function LabHub({ go }: { go: Go }) {
  const s = useStore()
  const st = (k: string) => (s.stats[k] ? `Đúng ${s.stats[k].ok}/${s.stats[k].total}` : 'Chưa làm')
  const last = s.tests[s.tests.length - 1]
  return (
    <div className="space-y-3">
      <h2 className="font-display text-lg font-bold tracking-wide uppercase">📝 Luyện đề</h2>
      <button onClick={() => go('mock')} className="w-full rounded-3xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 px-5 py-5 text-left text-white shadow-lg active:scale-95">
        <div className="text-3xl">⏱️</div>
        <div className="text-[10px] font-bold tracking-[0.3em] opacity-80">MOCK EXAM</div>
        <div className="mt-1 text-xl font-bold font-display">Thi thử rút gọn</div>
        <div className="text-sm opacity-90">~35 câu · 35 phút · Nghe + Đọc{last ? ` · lần gần nhất ~${last.score}` : ''}</div>
      </button>
      <h3 className="pt-1 font-bold text-slate-600">🎧 Nghe</h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        <Tile icon="🖼️" title="Part 1 Tranh ảnh" sub={part1Count() >= 1 ? `${st('l-p1')} · ${part1Count()} ảnh` : 'Chưa có ảnh, xem hướng dẫn'} color="bg-orange-500" onClick={() => go('practice', 'p1')} />
        <Tile icon="👂" title="Part 2 Hỏi–Đáp" sub={st('l-p2')} color="bg-indigo-500" onClick={() => go('listen')} />
        <Tile icon="💬" title="Part 3 Hội thoại" sub={st('l-p3')} color="bg-sky-500" onClick={() => go('practice', 'p3')} />
        <Tile icon="📢" title="Part 4 Bài nói" sub={st('l-p4')} color="bg-teal-500" onClick={() => go('practice', 'p4')} />
      </div>
      <h3 className="pt-1 font-bold text-slate-600">📖 Đọc</h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        <Tile icon="✍️" title="Part 5 Điền câu" sub="Trong mục Ngữ pháp" color="bg-violet-500" onClick={() => go('quiz')} />
        <Tile icon="🧩" title="Part 6 Điền đoạn" sub={st('r-p6')} color="bg-pink-500" onClick={() => go('practice', 'p6')} />
        <Tile icon="📄" title="Part 7 Đọc hiểu" sub={st('r-p7')} color="bg-amber-500" onClick={() => go('practice', 'p7')} />
      </div>
    </div>
  )
}
