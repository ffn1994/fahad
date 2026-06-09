// OpenTDB category IDs mapped to our game categories
const CAT_MAP = {
  football: 21, // Sports
  prophets: 20, // Mythology
  kuwait:   22, // Geography
  flags:    22, // Geography
}

// Points assigned by question index (0-5)
const POINTS = [200, 200, 400, 400, 600, 600]

// Decode URL3986-encoded strings from the API
function dec(s) {
  try { return decodeURIComponent(s) } catch { return s }
}

// Shuffle array randomly
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

// Fetch 6 questions for one category from OpenTDB
async function fetchCat(catId) {
  const cid = CAT_MAP[catId]
  const url = `https://opentdb.com/api.php?amount=6&category=${cid}&type=multiple&encode=url3986`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Network error for ${catId}`)

  const data = await res.json()

  // response_code 0 = success, 1 = no results, 5 = rate limit
  if (data.response_code !== 0 || !data.results?.length) {
    throw new Error(`API code ${data.response_code} for ${catId}`)
  }

  return data.results.map((q, i) => {
    const correct  = dec(q.correct_answer)
    const choices  = shuffle([...q.incorrect_answers.map(dec), correct])
    return {
      t: dec(q.question),          // question text
      c: choices,                   // shuffled choices array
      a: choices.indexOf(correct),  // correct answer index
      p: POINTS[i],                 // point value
    }
  })
}

// Fetch all 4 categories — stagger requests by 300ms to stay within rate limits
export async function fetchAllQuestions() {
  const ids = ['football', 'prophets', 'kuwait', 'flags']

  const entries = await Promise.all(
    ids.map((id, i) =>
      new Promise(resolve => setTimeout(resolve, i * 300))
        .then(() => fetchCat(id))
        .then(qs => [id, qs])
    )
  )

  return Object.fromEntries(entries)
}
