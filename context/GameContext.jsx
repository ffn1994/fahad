'use client'

import { createContext, useContext, useReducer } from 'react'
import { CATS } from '@/data/questions'

const initialState = {
  screen:           'home',
  teams:            ['الفريق 1', 'الفريق 2'],
  scores:           [0, 0],
  turn:             0,
  done:             [],
  catId:            null,
  qi:               0,
  fetchedQuestions: {}, // { football: [...], prophets: [...], kuwait: [...], flags: [...] }
}

function reducer(state, action) {
  switch (action.type) {

    case 'GO_REGISTER':
      return { ...state, screen: 'register' }

    // After team names entered → go to loading screen to fetch questions
    case 'START_GAME':
      return {
        ...initialState,
        teams:  action.teams,
        screen: 'loading',
      }

    // API fetch complete → store questions and move to categories
    case 'QUESTIONS_LOADED':
      return { ...state, fetchedQuestions: action.questions, screen: 'categories' }

    case 'START_CATEGORY':
      return { ...state, catId: action.catId, qi: 0, screen: 'question' }

    case 'SCORE': {
      const ns = [...state.scores]
      ns[state.turn % 2] += action.points
      return { ...state, scores: ns }
    }

    case 'NEXT_Q': {
      const nextQi  = state.qi + 1
      const newTurn = state.turn + 1
      // Each category always has exactly 6 questions
      const totalQs = (state.fetchedQuestions[state.catId] || []).length || 6

      if (nextQi >= totalQs) {
        const newDone = [...state.done, state.catId]
        if (newDone.length >= CATS.length) {
          return { ...state, turn: newTurn, qi: nextQi, done: newDone, screen: 'final' }
        }
        return { ...state, turn: newTurn, qi: nextQi, done: newDone, screen: 'categories' }
      }
      return { ...state, turn: newTurn, qi: nextQi }
    }

    case 'RESET':
      return initialState

    default:
      return state
  }
}

const GameContext = createContext(null)

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  return useContext(GameContext)
}
