import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import '../styles/home.css';

import fire from '../firebase';
import tokenService from '../util/tokenService';

import { pathsLogic, startingDeck, defaultDestinations } from '../game/gameDefault';

const db = fire.firestore();

export default function Home() {

  const [lobbyName, setLobbyName] = useState('');
  const [color, setColor] = useState('blue')
  const [username, setUsername] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const history = useHistory();

  const createLobby = async (e) => {
    e.preventDefault();
    let check, randomName, lName;
    if (lobbyName === '') {
      randomName = randomLobbyName();
      check = await db.collection(randomName).get();
      while (check.docs.length > 0) {
        randomName = randomLobbyName();
        check = await db.collection(randomName).get();
      }
    } else {
      check = await db.collection(lobbyName).get();
    }
    if (check.docs.length > 0) {
      setErrMsg('Lobby taken, please choose another name..')
    } else {
      lName = lobbyName === '' ? randomName : lobbyName;
      console.log(lName);
      await db.collection(lName).doc(username).set({
        color,
        hand: [],
        dCards: [],
        routes: [],
        points: 0,
        taxis: 17,
        host: true,
        ready: false
      });
      await db.collection(lName).doc('logic').set({
        deck: startingDeck,
        discard: [],
        destinations: defaultDestinations,
        paths: pathsLogic,
        gameOn: false,
        waiting: true,
        turn: 0,
        moves: 0,
        lastTurn: false,
        lastModified: Date.now()
      });
      let list = await db.collection('lobbyList').get();
      await db.collection('lobbyList').doc('list').update({ list: [...list.docs[0].data().list, lName] })
      tokenService.setTokenFromUser(username);
      history.push(`/${lName}`);
    }
  }

  useEffect(() => {
    localStorage.removeItem('token');
    let message = localStorage.getItem('message');
    localStorage.removeItem('message');
    if (message) {
      setErrMsg(message);
    }
  }, [])

  return (
    <main className="main-home">
      <h1>Ticket to Ride</h1>
      <p>Welcome to Ticket to Ride! Fill out the form below to create a lobby, then send the link created to you friends to invite them to play! Create a custom lobby name, or leave it blank for a randomly generated name.</p>
      {errMsg && <p className="err-message">{errMsg}</p>}
      <div className="form-wrapper">
        <form onSubmit={createLobby}>
          <div className="input">
            <input type="text" value={lobbyName} onChange={e => setLobbyName(e.target.value)} />
            <label className={`label ${lobbyName ? 'filled' : ''}`} ><span>Lobby Name</span></label>
          </div>
          <div className="input">
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
            <label className={`label ${username ? 'filled' : ''}`}><span>Username</span></label>
          </div>
          <div className="select-button">
            <select onChange={e => setColor(e.target.value)}>
              <option value='blue'>Blue</option>
              <option value='red'>Red</option>
              <option value='green'>Green</option>
              <option value='yellow'>Yellow</option>
            </select>
            <button type="submit" >Create Lobby</button>
          </div>
        </form>
      </div>
    </main>
  )
}


function randomLobbyName() {
  let options = '1234567890!@#$^*()_+=qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM,'
  let res = '';
  for (let i = 0; i < 6; i++) {
    res += options[Math.floor(Math.random() * options.length)]
  }
  return res;
}