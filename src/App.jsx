import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './styles/App.css';

import Home from './pages/Home';
import Lobby from './pages/Lobby';
import Game from './pages/Game';

import RemoveOldAGames from './pages/RemoveOldAGames';

function App() {

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/admin/trim' component={RemoveOldAGames} />
        <Route path='/:id/game' render={() => <Game /*reload={reload} load={load}*/ />} />
        <Route path='/:id' component={Lobby} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
