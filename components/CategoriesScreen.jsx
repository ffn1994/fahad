'use client'

import { useGame } from '@/context/GameContext'
import { CATS } from '@/data/questions'

export default function CategoriesScreen() {
  const { state, dispatch } = useGame()
  const { teams, scores, turn, done } = state
  const currentTeam = turn % 2

  return (
    <div className="screen categories-screen">
      {/* Score bar */}
      <div className="sbar">
        <div className={`tscore${currentTeam === 0 ? ' on' : ''}`}>
          <div className="tscore-n">{teams[0]}</div>
          <div className="tscore-v">{scores[0]}</div>
        </div>
        <div className={`tscore${currentTeam === 1 ? ' on' : ''}`}>
          <div className="tscore-n">{teams[1]}</div>
          <div className="tscore-v">{scores[1]}</div>
        </div>
      </div>

      <div className="turn-badge">دور: {teams[currentTeam]}</div>
      <div className="cats-label">اختر فئة</div>

      <div className="cgrid">
        {CATS.map((cat) => {
          const isDone = done.includes(cat.id)
          return (
            <div
              key={cat.id}
              className={`ccard ${cat.cls}${isDone ? ' done' : ''}`}
              onClick={() =>
                !isDone && dispatch({ type: 'START_CATEGORY', catId: cat.id })
              }
            >
              <div className="cicon">{cat.icon}</div>
              <div className="cname">{cat.name}</div>
              {isDone && <div className="cdone-mark">✓ مكتملة</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
