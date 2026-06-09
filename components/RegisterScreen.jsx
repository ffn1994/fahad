'use client'

import { useState } from 'react'
import { useGame } from '@/context/GameContext'

export default function RegisterScreen() {
  const { dispatch } = useGame()
  const [t1, setT1] = useState('')
  const [t2, setT2] = useState('')

  function handleReady() {
    dispatch({
      type: 'START_GAME',
      teams: [t1.trim() || 'الفريق 1', t2.trim() || 'الفريق 2'],
    })
  }

  return (
    <div className="screen register-screen">
      <div className="stitle">🏆 سجّل فريقك</div>

      <div className="igroup">
        <label className="ilabel">اسم الفريق الأول</label>
        <input
          className="tinput"
          placeholder="الفريق الأول"
          maxLength={20}
          value={t1}
          onChange={(e) => setT1(e.target.value)}
        />
      </div>

      <div className="igroup">
        <label className="ilabel">اسم الفريق الثاني</label>
        <input
          className="tinput"
          placeholder="الفريق الثاني"
          maxLength={20}
          value={t2}
          onChange={(e) => setT2(e.target.value)}
        />
      </div>

      <button className="btn-ready" onClick={handleReady}>
        جاهز؟ 🚀
      </button>
    </div>
  )
}
