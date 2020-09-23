import React, { useState } from 'react';
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
  );
}

export default App;
