const norm = (t: string) =>
  t
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9']/g, '')

const tokens = (s: string) => s.trim().split(/\s+/).filter(Boolean)

export type DiffResult = {
  ref: { word: string; ok: boolean }[]
  extra: string[] // từ người dùng gõ thừa/sai
  accuracy: number // 0..1
}

/** So sánh câu gõ với câu gốc theo từ (LCS), bỏ qua hoa/thường và dấu câu. */
export function diffSentence(reference: string, answer: string): DiffResult {
  const r = tokens(reference)
  const a = tokens(answer)
  const rn = r.map(norm)
  const an = a.map(norm)
  const dp: number[][] = Array.from({ length: r.length + 1 }, () => new Array(a.length + 1).fill(0))
  for (let i = 1; i <= r.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      dp[i][j] = rn[i - 1] === an[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1])
    }
  }
  const okRef = new Array(r.length).fill(false)
  const usedAns = new Array(a.length).fill(false)
  let i = r.length
  let j = a.length
  while (i > 0 && j > 0) {
    if (rn[i - 1] === an[j - 1]) {
      okRef[i - 1] = true
      usedAns[j - 1] = true
      i--
      j--
    } else if (dp[i - 1][j] >= dp[i][j - 1]) i--
    else j--
  }
  return {
    ref: r.map((word, k) => ({ word, ok: okRef[k] })),
    extra: a.filter((_, k) => !usedAns[k]),
    accuracy: r.length ? okRef.filter(Boolean).length / r.length : 0,
  }
}
