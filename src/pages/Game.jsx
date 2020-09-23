import React, { useState } from 'react'

import Board from '../components/Board';
import { paths, tokens } from '../game/gameDefault';

export default function Game() {

  const [gameState, setGameState] = useState({ paths, tokens });

  return (
    <div className="App">
      Game
      <Board gameState={gameState} />
    </div>
  )
}
