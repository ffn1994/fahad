'use client'

import { useState, useEffect, useCallback } from 'react'
import { useGame } from '@/context/GameContext'
import { CATS } from '@/data/questions'
import { sfxOk, sfxNo, sfxTick } from '@/lib/audio'
import FeedbackOverlay from './FeedbackOverlay'

const LABELS = ['أ', 'ب', 'ج', 'د']

export default function QuestionScreen() {
  const { state, dispatch } = useGame()
  const { teams, turn, catId, qi, fetchedQuestions } = state
  const currentTeam = turn % 2

  // Get current question from fetched API data
  const q = fetchedQuestions?.[catId]?.[qi]

  // Category metadata (name, icon) still comes from local CATS
  const cat = CATS.find((c) => c.id === catId)

  // ── Local UI state ──
  const [timeLeft,     setTimeLeft]     = useState(60)
  const [choicesShown, setChoicesShown] = useState(false)
  const [answered,     setAnswered]     = useState(false)
  const [selectedIdx,  setSelectedIdx]  = useState(null)
  const [feedback,     setFeedback]     = useState(null)

  // ── Advance to next question after feedback ──
  const advance = useCallback(() => dispatch({ type: 'NEXT_Q' }), [dispatch])

  function showFeedback(fb) {
    setFeedback(fb)
    setTimeout(() => { setFeedback(null); advance() }, 2000)
  }

  // ── Countdown timer ──
  useEffect(() => {
    if (answered) return
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) return 0
        if (t - 1 <= 10) sfxTick()
        return t - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [answered])

  // Watch for time-up
  useEffect(() => {
    if (timeLeft === 0 && !answered) {
      setAnswered(true)
      setChoicesShown(true)
      setSelectedIdx(-1)
      sfxNo()
      showFeedback({ correct: false, points: 0, message: '⏰ انتهى الوقت!' })
    }
  }, [timeLeft]) // eslint-disable-line

  // ── Show choices ──
  function handleShowChoices() {
    if (choicesShown || answered) return
    setChoicesShown(true)
  }

  // ── Verbal answer (no choices shown → bonus eligible) ──
  function handleVerbal(correct) {
    if (answered) return
    setAnswered(true)
    if (correct) {
      const pts = q.p + 50
      dispatch({ type: 'SCORE', points: pts })
      sfxOk()
      showFeedback({ correct: true, points: pts, message: '' })
    } else {
      setChoicesShown(true)
      setSelectedIdx(-1)
      sfxNo()
      showFeedback({ correct: false, points: 0, message: 'إجابة خاطئة!' })
    }
  }

  // ── Pick a multiple-choice answer ──
  function handlePick(i) {
    if (answered) return
    setAnswered(true)
    setSelectedIdx(i)
    if (i === q.a) {
      dispatch({ type: 'SCORE', points: q.p })
      sfxOk()
      showFeedback({ correct: true, points: q.p, message: '' })
    } else {
      sfxNo()
      showFeedback({ correct: false, points: 0, message: 'إجابة خاطئة!' })
    }
  }

  // ── Choice button class ──
  function choiceCls(i) {
    if (!answered) return 'cbtn'
    if (i === q.a) return 'cbtn ' + (selectedIdx === q.a ? 'ok' : 'rev')
    if (i === selectedIdx) return 'cbtn no'
    return 'cbtn'
  }

  // Guard — should never be null in practice
  if (!q) return null

  const urgent = timeLeft <= 10

  return (
    <div className="screen question-screen">
      {/* Header */}
      <div className="qhdr">
        <span className="qcat">{cat?.name} {cat?.icon}</span>
        <span className="qnum">سؤال {qi + 1}/6</span>
      </div>

      {/* Timer */}
      <div className="tbar">
        <div className={`tdisp${urgent ? ' urg' : ''}`}>{timeLeft}</div>
        <div className="tprog">
          <div
            className={`tprogb${urgent ? ' urg' : ''}`}
            style={{ width: (timeLeft / 60) * 100 + '%' }}
          />
        </div>
      </div>

      {/* Body */}
      <div className="qbody">
        <div className="qturn">🎯 دور: {teams[currentTeam]}</div>
        <div className="qpts">{q.p} نقطة</div>
        <div className="qtext">{q.t}</div>

        {/* Multiple-choice grid */}
        {choicesShown && (
          <div className="choices">
            {q.c.map((txt, i) => (
              <button
                key={i}
                className={choiceCls(i)}
                disabled={answered}
                onClick={() => handlePick(i)}
              >
                <span style={{ opacity: .55, fontSize: '.8rem' }}>{LABELS[i]}</span>
                <br />
                {txt}
              </button>
            ))}
          </div>
        )}

        {/* Verbal controls — visible only before choices shown */}
        {!choicesShown && !answered && (
          <>
            <div className="bonus-note">💡 أجب بدون الخيارات واكسب 50 نقطة إضافية!</div>
            <div className="verbal-row">
              <button className="btn-correct-v" onClick={() => handleVerbal(true)}>✓ صح</button>
              <button className="btn-wrong-v"   onClick={() => handleVerbal(false)}>✗ خطأ</button>
            </div>
            <button className="btn-show" onClick={handleShowChoices}>عرض الخيارات</button>
          </>
        )}
      </div>

      {/* Feedback overlay */}
      {feedback && (
        <FeedbackOverlay
          correct={feedback.correct}
          points={feedback.points}
          message={feedback.message}
        />
      )}
    </div>
  )
}
