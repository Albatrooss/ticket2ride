import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';

import fire from '../firebase';
import tokenService from '../util/tokenService';

import { pathsLogic, startingDeck, startingDestinations } from '../game/gameDefault';

const db = fire.firestore();

export default function Home() {

  const [lobbyName, setLobbyName] = useState('');
  const [username, setUsername] = useState('');
  const history = useHistory();

  const createLobby = () => {
    db.collection(lobbyName).doc(username).set({
      hand: [],
      routes: [],
      points: 0,
      taxis: 17,
      host: true
    });
    db.collection(lobbyName).doc('logic').set({
      cards: startingDeck,
      destinations: startingDestinations,
      paths: pathsLogic
    });
    tokenService.setTokenFromUser(username);
    history.push(`/${lobbyName}`);
  }

  return (
    <div>
      Home
      <label>Lobby Name</label>
      <input type="text" value={lobbyName} onChange={e => setLobbyName(e.target.value)} />
      <label>Username</label>
      <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
      <button onClick={createLobby}>Create Lobby</button>
    </div>
  )
}
