'use client'

export default function FeedbackOverlay({ correct, points, message }) {
  return (
    <div className="fov">
      <div className="ficon">{correct ? '✅' : '❌'}</div>
      <div className="ftxt">{correct ? 'إجابة صحيحة! 🎉' : message}</div>
      {correct && <div className="fpts">+{points} نقطة</div>}
    </div>
  )
}
