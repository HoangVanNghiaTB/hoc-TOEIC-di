export type NoteDraft = { title: string; body: string; tags: string[] }

let pending: NoteDraft | null = null

/** Mở màn Ghi chú với một bản nháp điền sẵn (ví dụ từ nút “Ghi chú” trên câu hỏi). */
export function draftNote(d: NoteDraft) {
  pending = d
  window.dispatchEvent(new Event('goto-notes'))
}

export function takeDraft(): NoteDraft | null {
  const d = pending
  pending = null
  return d
}
