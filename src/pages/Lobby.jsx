import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import '../styles/lobby.css';

import fire from '../firebase';
import tokenService from '../util/tokenService';

const db = fire.firestore();

const allColors = ['blue', 'red', 'green', 'yellow'];

export default function Lobby() {

  const { id } = useParams();
  const [username, setUsername] = useState('');
  const [color, setColor] = useState('');
  const [colorOptions, setColorOptions] = useState([]);
  const [takenColors, setTakenColors] = useState([]);
  const [users, setUsers] = useState([]);
  const [errMsg, setErrMsg] = useState('');
  const [host, setHost] = useState(false);
  const [logic, setLogic] = useState({});
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const userToken = tokenService.getUserFromToken();

  const history = useHistory();

  const joinLobby = e => {
    e.preventDefault();
    if (users.length > 3) {
      setErrMsg('Lobby Full..')
      return;
    }
    if (users.some(u => u.id === username)) {
      setErrMsg('Username allready taken');
    } else {
      db.collection(id).doc(username).set({
        color,
        hand: [],
        routes: [],
        dCards: [],
        points: 0,
        taxis: 17,
        host: users.length > 0 ? false : true,
        ready: false
      });
      tokenService.setTokenFromUser(username);
      setUsername('');
    }
  }

  const leaveLobby = async (userid) => {
    let dbRef = db.collection(id).doc(userid);
    let data = await dbRef.get();
    db.collection(id).doc(userid).delete();
    tokenService.removeToken();
    console.log(users)
    if (data.data().host && users.length !== 1) {
      db.collection(id).doc(users[0].id).set({
        ...users[0],
        host: true
      })
    }
  }

  const startGame = async () => {
    await db.collection(id).doc('logic').update({ order: shuffle(takenColors) });
    await dealDCards();
  }

  const dealDCards = async () => {
    let dests = logic.destinations;
    let available = [];

    users.forEach(u => {
      dealOne(u);
      dealOne(u);
      db.collection(id).doc(u.id).update({ dCards: u.dCards })
    })

    function dealOne(u) {
      available = dests.filter(x => !x.taken);
      let index = Math.floor(Math.random() * available.length)
      let card = available[index];
      dests.find(c => c.start === card.start && c.end === card.end).taken = true;
      u.dCards = [...u.dCards, { start: card.start, end: card.end, connected: false, points: card.points }];
    }


    db.collection(id).doc('logic').update({ destinations: dests, gameOn: true });
    console.log(logic, users);
  }

  const usersList = [];
  for (let i = 0; i < 4; i++) {
    usersList.push(
      users[i] ? <li >
        {i + 1}.<span className={`color-${users[i].color}`}>{users[i].id} {users[i].host ? '(host)' : ''}</span>
        {userToken && userToken.username === users[i].id ? <button onClick={() => leaveLobby(users[i].id)}><div className='x' /><div className='x' /></button> : ''}
      </li> : <li className="blank-li">{i + 1}. --empty slot--</li>
    )
  }

  const copyToClipboard = text => {
    console.log('test', text);
    let textField = document.createElement('textarea');
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  }

  useEffect(() => {
    let check = async () => {
      let c = await db.collection(id).get();
      if (c.docs.length < 1) history.push('/');
      localStorage.setItem('message', 'Lobby not found..');

      setLoading(false);
      return true;
    }
    const unsubscribe = db.collection(id).onSnapshot(snap => {
      const userList = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      if (userList.findIndex(x => x.gameOn) >= 0) {
        if (userToken) {
          history.push(`/${id}/game`);
        } else {
          localStorage.setItem('message', 'Game in progress..')
          history.push('/');
        }
      } else {
        let usersList = [];
        userList.forEach(x => {
          if (x.id !== 'logic') {
            usersList.push(x);
          } else {
            setLogic(x);
          }
        })
        setUsers(usersList);

        //assign taken colors
        let takenCols = [];
        usersList.forEach(u => takenCols.push(u.color));
        setTakenColors(takenCols)

        //figure out which colors are available
        let colOpts = allColors.filter(c => !takenCols.includes(c));
        setColorOptions(colOpts);
        setColor(colOpts[0]);

        const myToken = tokenService.getUserFromToken();
        if (myToken) {
          if (!userList.some(x => x.id === myToken.username)) {
            tokenService.removeToken()
            history.push(`/${id}`);
          }
          let host = userList.find(x => x.host);
          if (host.id === myToken.username) setHost(true);
        }
      }
    })
    check();
    return () => {
      unsubscribe();
    }
  }, [id, history])

  return loading ? (
    <h1>Loading...</h1>
  ) : (
      <main className="main-lobby">
        <div className="writing">
          <h2>Welcome to the Lobby!</h2>
          <p>Copy and paste this link to your friends to invite them to play!</p>
          <span onClick={() => copyToClipboard(`https://ticket-to-ride.netlify.app/${id.replace(/\s/g, '%20')}`)} className="link">https://ticket-to-ride.netlify.app/{id.replace(/\s/g, '%20')}{copied && <p className="copied">Copied!</p>}</span>
        </div>
        <div className="user-list">
          <h4>Users:</h4>
          <ul>
            {usersList}
          </ul>
          {!userToken && <>
            <p style={{ color: 'red' }}>{errMsg}</p>
            <div className="form-wrapper">
              <form onSubmit={joinLobby}>
                <div>
                  <input type="text" value={username} id="username" onChange={e => setUsername(e.target.value)} />
                  <label htmlFor="username" className={username ? 'filled' : ''}><span>Username</span></label>
                </div>
                <select onChange={e => setColor(e.target.value)}>
                  {colorOptions.map(c => <option value={c}>{c}</option>)}
                </select>
                <button type="submit">Join</button>
              </form>
            </div>
          </>}
          {host ?
            <button className="start-game-btn" onClick={startGame}>Start Game</button> :
            <>{userToken ? <p>Waiting for the host to start the game..</p> : <></>}</>
          }
        </div>
      </main>
    )
}


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}