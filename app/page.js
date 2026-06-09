'use client'

import { GameProvider, useGame } from '@/context/GameContext'
import HomeScreen       from '@/components/HomeScreen'
import RegisterScreen   from '@/components/RegisterScreen'
import LoadingScreen    from '@/components/LoadingScreen'
import CategoriesScreen from '@/components/CategoriesScreen'
import QuestionScreen   from '@/components/QuestionScreen'
import FinalScreen      from '@/components/FinalScreen'

function GameRouter() {
  const { state } = useGame()

  switch (state.screen) {
    case 'home':       return <HomeScreen />
    case 'register':   return <RegisterScreen />
    case 'loading':    return <LoadingScreen />
    case 'categories': return <CategoriesScreen />
    // key forces a full remount (fresh timer) on every new question
    case 'question':   return <QuestionScreen key={`${state.catId}-${state.qi}`} />
    case 'final':      return <FinalScreen />
    default:           return <HomeScreen />
  }
}

export default function Page() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  )
}
