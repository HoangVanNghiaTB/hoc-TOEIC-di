import { useState } from 'react'
import { LESSONS } from '../data/lessons'
import { QUESTIONS, TAGS } from '../data/questions'
import { markLesson, useStore } from '../lib/store'
import { speak } from '../lib/audio'
import type { Tab } from '../App'

export default function Lessons({ go }: { go: (t: Tab, param?: string) => void }) {
  const s = useStore()
  const [openId, setOpenId] = useState<string | null>(null)
  const lesson = LESSONS.find((l) => l.id === openId)

  if (lesson) {
    const done = s.lessons.includes(lesson.id)
    const count = QUESTIONS.filter((q) => q.tag === lesson.id).length
    return (
      <div className="space-y-4">
        <button onClick={() => setOpenId(null)} className="text-sm text-indigo-600">
          ← Danh sách bài
        </button>
        <div className="rounded-3xl bg-white p-5 shadow">
          <h2 className="text-xl font-extrabold text-indigo-700">{lesson.title}</h2>
          <div className="mt-3 rounded-2xl bg-amber-50 p-3 text-sm text-amber-800">💡 Mẹo: {lesson.tip}</div>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed">
            {lesson.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow">
          <h3 className="font-bold">Ví dụ</h3>
          <div className="mt-2 space-y-3">
            {lesson.examples.map(([en, vi]) => (
              <div key={en} className="rounded-2xl bg-slate-50 p-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold">{en}</span>
                  <button onClick={() => void speak(en)} className="shrink-0 rounded-full bg-indigo-50 px-2 py-1 text-sm">
                    🔊
                  </button>
                </div>
                <div className="text-sm text-slate-500">{vi}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() => go('quiz', lesson.id)}
            className="rounded-2xl bg-indigo-600 py-4 font-bold text-white shadow"
          >
            Luyện {count} câu về chủ đề này
          </button>
          <button
            onClick={() => markLesson(lesson.id)}
            disabled={done}
            className="rounded-2xl bg-emerald-500 py-3 font-bold text-white shadow disabled:bg-slate-300"
          >
            {done ? '✔ Đã học xong bài này' : 'Đánh dấu đã học (+10 XP)'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="rounded-3xl bg-white p-5 shadow">
        <h2 className="text-lg font-extrabold">📖 Bài ngữ pháp</h2>
        <p className="mt-1 text-sm text-slate-500">
          Đã học {s.lessons.length}/{LESSONS.length} bài. Đọc ngắn, rồi làm bài tập ngay để nhớ lâu.
        </p>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
      {LESSONS.map((l) => {
        const t = TAGS.find((x) => x.id === l.id)
        const st = s.stats[l.id]
        return (
          <button
            key={l.id}
            onClick={() => setOpenId(l.id)}
            className="flex w-full items-center justify-between rounded-2xl border border-transparent bg-white px-4 py-4 text-left shadow-sm transition hover:border-indigo-400"
          >
            <div>
              <div className="font-bold">
                {t?.icon} {l.title}
              </div>
              <div className="text-xs text-slate-400">
                {st ? `Đúng ${st.ok}/${st.total} câu` : 'Chưa luyện'}
              </div>
            </div>
            <span className="text-lg">{s.lessons.includes(l.id) ? '✅' : '›'}</span>
          </button>
        )
      })}
      </div>
    </div>
  )
}
