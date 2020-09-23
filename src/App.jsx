import React, { useState } from 'react';
<<<<<<< HEAD
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './App.css';

import Home from './pages/Home';
import Lobby from './pages/Lobby';
import Game from './pages/Game';

function App() {

  // const [gameState, setGameState] = useState({
  //   paths: paths,
  //   tokens: tokens
  // })

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/:id/game' component={Game} />
        <Route path='/:id' component={Lobby} />
      </Switch>
    </BrowserRouter>
=======
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
>>>>>>> 3b710aa6baaa21a23a121676fbd4a32625a6572e
  );
}

export default App;
