import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import firebase from '../firebase';

import Board from '../components/Board';
import Hand from '../components/Hand';

import tokenService from '../util/tokenService';
import { defaultPaths } from '../game/gameDefault';
import { checkConnected } from '../util/traffic';

const db = firebase.firestore();

export default function Game() {

  const { id } = useParams();

  const [logic, setLogic] = useState([]);
  const [users, setUsers] = useState({});
  const [user, setUser] = useState({ cards: [] })

  const handleClaimLine = async (outerKey, innerKey, points) => {
    try {
      let newRoutes = user.routes;
      defaultPaths[outerKey][innerKey].nodes.forEach(n => {
        if (!newRoutes.includes(n)) newRoutes.push(n);
      });
      await db.collection(id).doc(user.id).update({ routes: newRoutes, points: user.points + points })
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const unsubscribe = db.collection(id).onSnapshot(snap => {
      const connectedData = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      let logicData;
      let usersData = [];
      connectedData.forEach(data => {
        if (data.id === 'logic') {
          logicData = data;
        } else if (data.id === tokenService.getUserFromToken().username) {
          setUser(data)
        } else {
          usersData.push(data);
        }
      });
      setLogic(logicData);
      setUsers(usersData);
    })
    return () => {
      unsubscribe();
    }
  }, [])

  return (
    <div className="App">
      Game
      <Board logic={logic} handleClaimLine={handleClaimLine} />
      <h2>{user.id}</h2>
      {/* <Hand  /> */}
      <button onClick={() => checkConnected(user, 1) ? alert('connected') : alert('not connected')}>CLICK</button>
      <ul>
        {user.dCards && user.dCards.map(d => (<li>{d.start}-{d.end}</li>))}
      </ul>
    </div>
  )
}
