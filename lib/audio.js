let audioCtx = null

function getCtx() {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioCtx
}

function tone(freq, duration, type = 'sine', vol = 0.28) {
  const ctx = getCtx()
  if (!ctx) return
  try {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    gain.gain.setValueAtTime(vol, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  } catch (e) {}
}

export function sfxOk() {
  tone(523, 0.12)
  setTimeout(() => tone(659, 0.12), 130)
  setTimeout(() => tone(784, 0.28), 260)
}

export function sfxNo() {
  tone(220, 0.15, 'sawtooth')
  setTimeout(() => tone(165, 0.25, 'sawtooth'), 180)
}

export function sfxTick() {
  tone(880, 0.05, 'square', 0.1)
}

export function sfxHS() {
  ;[523, 587, 659, 698, 784, 880].forEach((f, i) =>
    setTimeout(() => tone(f, 0.2), i * 90)
  )
}
