'use client'

import { useEffect, useState } from 'react'
import { useGame } from '@/context/GameContext'
import { getHS } from '@/lib/storage'

const SYMBOLS = ['?', '!', '?', '💡', '🧠', '?', '!', '⭐', '?', '💭', '!', '?', '🎯', '❓']

export default function HomeScreen() {
  const { dispatch } = useGame()
  const [hs, setHs] = useState({ score: 0, team: '' })
  const [floats, setFloats] = useState([])

  useEffect(() => {
    setHs(getHS())
    setFloats(
      SYMBOLS.map((sym, i) => ({
        id: i,
        sym,
        left: Math.random() * 92,
        duration: 9 + Math.random() * 13,
        delay: Math.random() * 12,
        size: 1.4 + Math.random() * 1.8,
      }))
    )
  }, [])

  return (
    <div className="screen home-screen">
      <div className="floating-bg">
        {floats.map((f) => (
          <div
            key={f.id}
            className="fi"
            style={{
              left: f.left + '%',
              animationDuration: f.duration + 's',
              animationDelay: f.delay + 's',
              fontSize: f.size + 'rem',
            }}
          >
            {f.sym}
          </div>
        ))}
      </div>

      <div className="home-logo">أنزلي</div>
      <div className="home-sub">لعبة المسابقات الجماعية</div>

      <button className="btn-start" onClick={() => dispatch({ type: 'GO_REGISTER' })}>
        أنزلي
      </button>

      <div className="hs-home">
        {hs.score > 0 ? (
          <>
            🏆 الرقم القياسي: <strong>{hs.score}</strong> نقطة
            <br />
            <span style={{ fontSize: '.82rem' }}>{hs.team}</span>
          </>
        ) : (
          '🎮 كن أول من يحقق رقماً قياسياً!'
        )}
      </div>
    </div>
  )
}
