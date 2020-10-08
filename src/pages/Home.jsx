import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';

import fire from '../firebase';
import tokenService from '../util/tokenService';

import { pathsLogic, startingDeck, defaultDestinations, defaultPaths } from '../game/gameDefault';

const db = fire.firestore();

export default function Home() {

  const [lobbyName, setLobbyName] = useState('');
  const [color, setColor] = useState('blue')
  const [username, setUsername] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const history = useHistory();

  const createLobby = async () => {
    let check = await db.collection(lobbyName).get();
    if (check.docs.length > 0) {
      setErrMsg('Lobby taken, please choose another name..')
    } else {
      db.collection(lobbyName).doc(username).set({
        color,
        hand: [],
        dCards: [],
        routes: [],
        points: 0,
        taxis: 17,
        host: true,
      });
      db.collection(lobbyName).doc('logic').set({
        deck: startingDeck,
        discard: [],
        destinations: defaultDestinations,
        paths: pathsLogic,
        gameOn: false,
        waiting: true,
        turn: 0,
        moves: 0
      });
      tokenService.setTokenFromUser(username);
      history.push(`/${lobbyName}`);
    }
  }

  useEffect(() => {
    localStorage.removeItem('token');
  }, [])

  return (
    <div>
      Home
      {errMsg && <p className="err-message">{errMsg}</p>}
      <label>Lobby Name</label>
      <input type="text" value={lobbyName} onChange={e => setLobbyName(e.target.value)} />
      <label>Username</label>
      <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
      <select onChange={e => setColor(e.target.value)}>
        <option value='blue'>Blue</option>
        <option value='red'>Red</option>
        <option value='green'>Green</option>
        <option value='yellow'>Yellow</option>
      </select>
      <button onClick={createLobby}>Create Lobby</button>
    </div>
  )
}
