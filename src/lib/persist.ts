import { adoptState, getState, subscribeStore } from './store'
import type { State } from './store'

/**
 * Tự lưu tiến trình ra file progress/progress.json qua máy chủ dev (npm run dev).
 * - Khi mở web: nếu file mới hơn dữ liệu trong trình duyệt thì nạp từ file (ví dụ trình duyệt bị xóa dữ liệu).
 * - Sau mỗi thay đổi: ghi file (gộp thao tác, tối đa 1 lần mỗi ~1,5 giây).
 * Chạy ở bản host tĩnh thì tự tắt.
 */
export type PersistStatus = { state: 'off' | 'ok' | 'error'; at?: number; restored?: boolean; msg?: string }

let status: PersistStatus = { state: 'off' }
const subs = new Set<() => void>()
export const persistStatus = () => status
export function onPersistStatus(cb: () => void) {
  subs.add(cb)
  return () => {
    subs.delete(cb)
  }
}
function setStatus(s: PersistStatus) {
  status = s
  subs.forEach((f) => f())
}

const HEADERS = { 'Content-Type': 'application/json', 'x-progress': '1' }
let enabled = false
let savedStamp = 0
let timer = 0
let inFlight = false

async function save(keepalive = false) {
  const st = getState()
  if (!enabled || st.updatedAt <= 0 || st.updatedAt === savedStamp || inFlight) return
  inFlight = true
  try {
    const r = await fetch('/api/progress', { method: 'PUT', headers: HEADERS, body: JSON.stringify(st), keepalive: keepalive && JSON.stringify(st).length < 60_000 })
    if (r.ok) {
      savedStamp = st.updatedAt
      setStatus({ state: 'ok', at: Date.now(), restored: status.restored })
    } else if (r.status === 409) {
      setStatus({ state: 'error', msg: 'File trên đĩa mới hơn dữ liệu trong trình duyệt. Hãy tải lại trang để nạp từ file.' })
    } else {
      setStatus({ state: 'error', msg: `Không ghi được file (mã ${r.status}).` })
    }
  } catch {
    setStatus({ state: 'error', msg: 'Không kết nối được máy chủ để ghi file.' })
  } finally {
    inFlight = false
  }
  if (getState().updatedAt !== savedStamp && getState().updatedAt > 0) schedule()
}

function schedule() {
  window.clearTimeout(timer)
  timer = window.setTimeout(() => void save(), 1500)
}

/** Gọi một lần trước khi hiển thị web. Không bao giờ ném lỗi. */
export async function initPersist(): Promise<void> {
  try {
    const ctl = new AbortController()
    const t = window.setTimeout(() => ctl.abort(), 2500)
    const r = await fetch('/api/progress', { headers: { 'x-progress': '1' }, cache: 'no-store', signal: ctl.signal })
    window.clearTimeout(t)
    const ct = r.headers.get('content-type') ?? ''
    if (r.status === 404 && ct.includes('json')) {
      enabled = true // máy chủ có hỗ trợ, nhưng chưa có file: sẽ tạo khi có dữ liệu
    } else if (r.ok && ct.includes('json')) {
      enabled = true
      const file = (await r.json()) as Partial<State>
      const local = getState()
      if (typeof file.cards === 'object' && (file.updatedAt ?? 0) > local.updatedAt) {
        adoptState(file)
        savedStamp = file.updatedAt ?? 0
        setStatus({ state: 'ok', at: Date.now(), restored: true })
      } else if ((file.updatedAt ?? 0) === local.updatedAt) {
        savedStamp = local.updatedAt
      }
    }
  } catch {
    enabled = false
  }
  if (!enabled) return
  if (status.state === 'off') setStatus({ state: 'ok', restored: false })
  subscribeStore(schedule)
  window.addEventListener('pagehide', () => void save(true))
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') void save(true)
  })
  if (getState().updatedAt > savedStamp) schedule() // dữ liệu trong trình duyệt mới hơn file: ghi lại
}

/** Ép lưu ngay (nút “Lưu ngay” trong Cài đặt). */
export function saveNow() {
  savedStamp = 0
  void save()
}
