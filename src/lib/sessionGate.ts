import { useEffect } from 'react'
import { gateStatus, planFor } from './plan'
import { sessionKey, togglePlanTask, useStore } from './store'

/** Tự đánh dấu xong các mục Part 5/6/7 khi đạt điểm tối thiểu trong buổi hiện tại. */
export function useSessionGate() {
  const s = useStore()
  useEffect(() => {
    const plan = planFor(s.sessionNo, s.settings.newPerDay, s.settings.planMin)
    const key = sessionKey(s.sessionNo)
    const done = s.planDone[key] ?? []
    const ids = plan.tasks.map((t) => t.id)
    for (const t of plan.tasks) {
      if (!t.gate || done.includes(t.id)) continue
      if (gateStatus(s.sessionAnswers[String(s.sessionNo)]?.[t.gate.stat], t.gate.need).pass) {
        togglePlanTask(key, t.id, ids, true)
        break // mỗi lần chỉ xử lý một mục; effect sẽ chạy lại khi state đổi
      }
    }
  }, [s.sessionAnswers, s.sessionNo, s.planDone, s.settings.newPerDay, s.settings.planMin])
}
