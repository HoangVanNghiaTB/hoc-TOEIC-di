// Giọng đọc (TTS) và hiệu ứng âm thanh, dùng API có sẵn của trình duyệt.

let voices: SpeechSynthesisVoice[] = []

function refreshVoices() {
  if ('speechSynthesis' in window) voices = window.speechSynthesis.getVoices()
}
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  refreshVoices()
  window.speechSynthesis.addEventListener?.('voiceschanged', refreshVoices)
}

export const ttsSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window

function pickVoice(lang: 'en' | 'vi'): SpeechSynthesisVoice | undefined {
  const prefix = lang === 'en' ? 'en' : 'vi'
  const list = voices.filter((v) => v.lang.toLowerCase().startsWith(prefix))
  if (lang === 'en') {
    return (
      list.find((v) => v.lang === 'en-US' && /google|natural|aria|jenny|samantha/i.test(v.name)) ??
      list.find((v) => v.lang === 'en-US') ??
      list[0]
    )
  }
  return list[0]
}

export const hasVietnameseVoice = () => !!pickVoice('vi')

/** Đọc một đoạn; resolve khi đọc xong (hoặc lỗi/không hỗ trợ). */
export function speak(
  text: string,
  lang: 'en' | 'vi' = 'en',
  rate = 1,
  opts?: { voice?: 0 | 1; pitch?: number },
): Promise<void> {
  return new Promise((resolve) => {
    if (!ttsSupported()) return resolve()
    const u = new SpeechSynthesisUtterance(text)
    let v = pickVoice(lang)
    if (lang === 'en' && opts?.voice === 1) {
      // giọng thứ hai: chọn giọng tiếng Anh khác giọng mặc định nếu máy có
      const others = voices.filter((x) => x.lang.toLowerCase().startsWith('en') && x !== v)
      v = others.find((x) => x.lang === 'en-GB') ?? others[0] ?? v
    }
    if (v) u.voice = v
    if (opts?.pitch) u.pitch = opts.pitch
    u.lang = lang === 'en' ? 'en-US' : 'vi-VN'
    u.rate = rate
    u.onend = () => resolve()
    u.onerror = () => resolve()
    window.speechSynthesis.speak(u)
  })
}

export function stopSpeaking() {
  if (ttsSupported()) window.speechSynthesis.cancel()
}

// ---- Hiệu ứng âm thanh bằng WebAudio ----
let ctx: AudioContext | null = null

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', gain = 0.12) {
  try {
    ctx ??= new AudioContext()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = type
    o.frequency.value = freq
    const t0 = ctx.currentTime + start
    g.gain.setValueAtTime(gain, t0)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
    o.connect(g).connect(ctx.destination)
    o.start(t0)
    o.stop(t0 + dur)
  } catch {
    /* bỏ qua */
  }
}

export const sfx = {
  good: () => {
    tone(660, 0, 0.12)
    tone(880, 0.09, 0.16)
  },
  bad: () => {
    tone(220, 0, 0.18, 'sawtooth', 0.08)
    tone(165, 0.12, 0.22, 'sawtooth', 0.08)
  },
  win: () => {
    ;[523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.1, 0.2))
  },
}
