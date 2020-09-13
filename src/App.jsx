import React, { useState } from 'react';
import './styles/App.css';

import { paths, tokens } from './game/gameDefault';

import Board from './components/Board';

function App() {

  const [gameState, setGameState] = useState({
    paths: paths,
    tokens: tokens
  })

  return (
    <div className="App">
      <h1>Ticket to Ride</h1>
      <Board gameState={gameState} />
    </div>
  );
}

export default App;
