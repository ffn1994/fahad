'use client'

import { useEffect, useRef, useState } from 'react'
import { useGame } from '@/context/GameContext'
import { fetchAllQuestions } from '@/lib/api'
import { CATS } from '@/data/questions'

export default function LoadingScreen() {
  const { dispatch } = useGame()
  const [progress, setProgress] = useState(0)
  const [error, setError]       = useState(false)
  const started = useRef(false)

  async function load() {
    setError(false)
    setProgress(0)

    // Animate the bar while fetching
    const ticker = setInterval(() => {
      setProgress(p => (p < 80 ? p + 8 : p))
    }, 300)

    try {
      const questions = await fetchAllQuestions()
      clearInterval(ticker)
      setProgress(100)
      setTimeout(() => dispatch({ type: 'QUESTIONS_LOADED', questions }), 400)
    } catch (err) {
      console.warn('OpenTDB failed, using built-in questions:', err.message)
      clearInterval(ticker)

      // Graceful fallback — use the hardcoded questions from data/questions.js
      const fallback = Object.fromEntries(CATS.map(c => [c.id, c.qs]))
      setProgress(100)
      setTimeout(() => dispatch({ type: 'QUESTIONS_LOADED', questions: fallback }), 400)
    }
  }

  useEffect(() => {
    if (started.current) return
    started.current = true
    load()
  }, []) // eslint-disable-line

  return (
    <div className="screen loading-screen">
      <div className="home-logo" style={{ fontSize: '4rem', marginBottom: '24px' }}>
        أنزلي
      </div>

      <div className="loading-text">جاري تحميل الأسئلة…</div>

      <div className="loading-bar-wrap">
        <div className="loading-bar" style={{ width: progress + '%' }} />
      </div>

      <div className="loading-sub">
        {error ? '⚠️ خطأ في الاتصال، جاري استخدام الأسئلة المحلية…' : '🌐 يتم جلب الأسئلة من OpenTDB'}
      </div>

      {error && (
        <button className="btn-ready" style={{ marginTop: '24px', maxWidth: '220px' }} onClick={load}>
          إعادة المحاولة
        </button>
      )}
    </div>
  )
}
