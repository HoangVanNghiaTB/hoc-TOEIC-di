import { useEffect, useState } from 'react'
import Home from './screens/Home'
import Flashcards from './screens/Flashcards'
import Match from './screens/Match'
import Typing from './screens/Typing'
import Radio from './screens/Radio'
import Settings from './screens/Settings'
import Order from './screens/Order'
import Dictation from './screens/Dictation'
import Listening from './screens/Listening'
import Quiz from './screens/Quiz'
import Lessons from './screens/Lessons'
import Teacher from './screens/Teacher'
import Notes from './screens/Notes'
import Podcast from './screens/Podcast'
import Practice from './screens/Practice'
import Mock from './screens/Mock'
import Plan from './screens/Plan'
import Check from './screens/Check'
import Progress from './screens/Progress'
import { useSessionGate } from './lib/sessionGate'
import { usePart1 } from './lib/part1'
import { GamesHub, GrammarHub, LabHub } from './screens/Hubs'
import { useStore } from './lib/store'
import AppShell from './components/ui/AppShell'
import type { NavGroup } from './components/ui/AppShell'
import type { Tag } from './data/questions'

export type Tab =
  | 'home'
  | 'plan'
  | 'check'
  | 'progress'
  | 'learn'
  | 'games'
  | 'match'
  | 'typing'
  | 'order'
  | 'dictation'
  | 'listen'
  | 'podcast'
  | 'radio'
  | 'grammar'
  | 'lessons'
  | 'quiz'
  | 'review'
  | 'teacher'
  | 'notes'
  | 'lab'
  | 'practice'
  | 'mock'
  | 'settings'

type Group = NavGroup

const GROUP: Record<Tab, Group> = {
  home: 'home',
  plan: 'home',
  check: 'home',
  progress: 'home',
  learn: 'learn',
  games: 'games',
  match: 'games',
  typing: 'games',
  order: 'games',
  dictation: 'games',
  listen: 'games',
  podcast: 'games',
  radio: 'games',
  grammar: 'grammar',
  lessons: 'grammar',
  quiz: 'grammar',
  review: 'grammar',
  teacher: 'teacher',
  notes: 'notes',
  lab: 'lab',
  practice: 'lab',
  mock: 'lab',
  settings: 'settings',
}

/** Các màn hình thao tác (làm bài, chơi) dùng cột hẹp; màn tổng hợp dùng bố cục rộng. */
const WIDE = new Set<Tab>(['home', 'plan', 'progress', 'games', 'grammar', 'lab', 'notes', 'teacher', 'settings', 'practice', 'mock', 'podcast', 'lessons'])

export default function App() {
  // Cho phép mở thẳng một màn qua địa chỉ, ví dụ /?tab=plan hoặc /?tab=practice&param=p6 (chỉ nhận tab hợp lệ).
  const initial = (() => {
    try {
      const q = new URLSearchParams(window.location.search)
      const t = q.get('tab') as Tab | null
      return { tab: t && t in GROUP ? t : ('home' as Tab), param: q.get('param') ?? undefined }
    } catch {
      return { tab: 'home' as Tab, param: undefined }
    }
  })()
  const [tab, setTab] = useState<Tab>(initial.tab)
  const [param, setParam] = useState<string | undefined>(initial.param)
  const [teacherKey, setTeacherKey] = useState(0)
  const [notesKey, setNotesKey] = useState(0)
  const s = useStore()
  useSessionGate()
  usePart1() // cập nhật giao diện khi danh sách ảnh Part 1 tải xong

  const go = (t: Tab, p?: string) => {
    setTab(t)
    setParam(p)
  }
  useEffect(() => {
    const h = () => {
      setTeacherKey((k) => k + 1) // mở lại giáo viên với ngữ cảnh mới
      go('teacher')
    }
    const hn = () => {
      setNotesKey((k) => k + 1) // mở ghi chú với bản nháp mới
      go('notes')
    }
    window.addEventListener('goto-teacher', h)
    window.addEventListener('goto-notes', hn)
    return () => {
      window.removeEventListener('goto-teacher', h)
      window.removeEventListener('goto-notes', hn)
    }
  }, [])
  const group = GROUP[tab]
  const back = () => go(group === 'games' || group === 'grammar' || group === 'lab' ? group : 'home')

  return (
    <AppShell tab={tab} group={group} go={(t) => go(t as Tab)} back={back} wide={WIDE.has(tab)}>
      {tab === 'home' && <Home go={go} />}
      {tab === 'plan' && <Plan go={go} />}
      {tab === 'progress' && <Progress go={go} />}
      {tab === 'check' && <Check key={param ?? 'new'} mode={param === 'review' ? 'review' : 'new'} goBack={() => go('plan')} />}
      {tab === 'learn' && <Flashcards goHome={() => go('home')} />}
      {tab === 'games' && <GamesHub go={go} />}
      {tab === 'match' && <Match goHome={back} />}
      {tab === 'typing' && <Typing goHome={back} />}
      {tab === 'order' && <Order goHome={back} />}
      {tab === 'dictation' && <Dictation goBack={back} />}
      {tab === 'listen' && <Listening goBack={back} />}
      {tab === 'podcast' && <Podcast goBack={back} />}
      {tab === 'radio' && <Radio />}
      {tab === 'grammar' && <GrammarHub go={go} />}
      {tab === 'lessons' && <Lessons go={go} />}
      {tab === 'quiz' && <Quiz key={param ?? 'all'} mode="run" initialTag={param as Tag | undefined} goBack={back} />}
      {tab === 'review' && <Quiz mode="review" goBack={back} />}
      {tab === 'lab' && <LabHub go={go} />}
      {tab === 'practice' && <Practice key={param} kind={(param as 'p1' | 'p3' | 'p4' | 'p6' | 'p7') ?? 'p3'} goBack={back} />}
      {tab === 'mock' && <Mock goBack={back} />}
      {tab === 'notes' && <Notes key={notesKey} />}
      {tab === 'teacher' && <Teacher key={teacherKey} />}
      {tab === 'settings' && <Settings />}
    </AppShell>
  )
}
