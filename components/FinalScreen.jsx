'use client'

import { useEffect, useState } from 'react'
import { useGame } from '@/context/GameContext'
import { getHS, saveHS } from '@/lib/storage'
import { sfxHS } from '@/lib/audio'

const EMOJIS = ['🎉', '🎊', '⭐', '🌟', '✨', '🏆', '🎈', '💫']

export default function FinalScreen() {
  const { state, dispatch } = useGame()
  const { teams, scores } = state
  const [newRecord, setNewRecord] = useState(false)
  const [hsData, setHsData] = useState({ score: 0, team: '' })
  const [particles, setParticles] = useState([])

  const tie = scores[0] === scores[1]
  const wi = scores[0] >= scores[1] ? 0 : 1
  const top = Math.max(...scores)

  useEffect(() => {
    const hs = getHS()
    setHsData(hs)

    if (top > hs.score && top > 0) {
      const wt = tie ? teams[0] : teams[wi]
      saveHS(top, wt)
      setNewRecord(true)
      sfxHS()
    }

    // Spawn particles
    const pts = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      left: Math.random() * 100,
      size: 1.4 + Math.random() * 2,
      duration: 1.5 + Math.random() * 1.5,
      delay: i * 0.08,
    }))
    setParticles(pts)
    const t = setTimeout(() => setParticles([]), 3500)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line

  return (
    <div className="screen final-screen">
      {/* Celebration particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="part"
          style={{
            left: p.left + 'vw',
            top: '100vh',
            fontSize: p.size + 'rem',
            animationDuration: p.duration + 's',
            animationDelay: p.delay + 's',
          }}
        >
          {p.emoji}
        </div>
      ))}

      <div className="ftitle">🏆 النتيجة النهائية</div>

      {/* Winner box */}
      <div className="wbox">
        <div className="wcrown">{tie ? '🤝' : '👑'}</div>
        <div className="wname">{tie ? 'تعادل!' : `🎉 ${teams[wi]}`}</div>
        <div className="wscore">{top} نقطة</div>
      </div>

      {/* Score rows */}
      <div className="srows">
        {teams.map((name, i) => (
          <div key={i} className={`srow${i === wi && !tie ? ' win' : ''}`}>
            <span>{name}</span>
            <strong>{scores[i]} نقطة</strong>
          </div>
        ))}
      </div>

      {/* New high score badge */}
      {newRecord && (
        <div className="hsbadge">
          🌟 رقم قياسي جديد!
          <br />
          {tie ? teams[0] : teams[wi]} — {top} نقطة
        </div>
      )}

      {/* Existing high score info */}
      {!newRecord && hsData.score > 0 && (
        <div className="hsinfo">
          🏆 الرقم القياسي الحالي: {hsData.score} نقطة — {hsData.team}
        </div>
      )}

      <button className="btn-again" onClick={() => dispatch({ type: 'RESET' })}>
        العب مجدداً 🎮
      </button>
    </div>
  )
}
