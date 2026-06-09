export function getHS() {
  if (typeof window === 'undefined') return { score: 0, team: '' }
  try {
    const v = localStorage.getItem('enzli_hs')
    return v ? JSON.parse(v) : { score: 0, team: '' }
  } catch (e) {
    return { score: 0, team: '' }
  }
}

export function saveHS(score, team) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('enzli_hs', JSON.stringify({ score, team }))
  } catch (e) {}
}
