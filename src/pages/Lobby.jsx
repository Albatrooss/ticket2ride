import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import fire from '../firebase';
import tokenService from '../util/tokenService';

import { defaultDestinations } from '../game/gameDefault';

const db = fire.firestore();

export default function Lobby() {

  const { id } = useParams();
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([]);
  const [errMsg, setErrMsg] = useState('');
  const [host, setHost] = useState(false);
  const [logic, setLogic] = useState({});

  const userToken = tokenService.getUserFromToken();

  const history = useHistory();

  const joinLobby = () => {
    if (users.some(u => u.id === username)) {
      setErrMsg('Username allready taken');
    } else {
      db.collection(id).doc(username).set({
        hand: [],
        routes: [],
        dCards: [],
        points: 0,
        taxis: 17,
        host: users.length > 0 ? false : true
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
    let thisId = userToken.username;
    await dealDCards();
    await db.collection(id).doc(thisId).update({ gameOn: true })
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
      let card = available[Math.floor(Math.random() * available.length)];
      dests.find(c => c.start === card.start && c.end === card.end).taken = true;
      u.dCards = [...u.dCards, { start: card.start, end: card.end, connected: false }];
    }


    db.collection(id).doc('logic').update({ destinations: dests });
    console.log(logic, users);
  }

  const usersList = users.map(u =>
    <li key={u.id}>{u.id}{u.host ? '-HOST' : ''}
      {userToken && userToken.username === u.id ? <button onClick={() => leaveLobby(u.id)}>X</button> : ''}
    </li>
  )

  useEffect(() => {
    const unsubscribe = db.collection(id).onSnapshot(snap => {
      const userList = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      if (userList.findIndex(x => x.gameOn) >= 0) {
        history.push(`/${id}/game`);
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
    return () => {
      unsubscribe();
    }
  }, [id])

  return (
    <>
      <h2>Game {id} Lobby</h2>
      <h4>Users:</h4>
      <ul>
        {usersList}
      </ul>
      {!userToken && <>
        <p style={{ color: 'red' }}>{errMsg}</p>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
        <button onClick={joinLobby}>Join</button>
      </>}
      {host && <>
        <p>YOU ARE THE HOST</p>
        <button onClick={startGame}>Start Game</button>
        <button onClick={() => dealDCards(users[0])}>CLICK ME</button>
      </>}
    </>
  )
}
