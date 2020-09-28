import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import firebase from '../firebase';

import Board from '../components/Board';
import Hand from '../components/Hand';
import tokenService from '../util/tokenService';

const db = firebase.firestore();

export default function Game() {

  const { id } = useParams();

  const [logic, setLogic] = useState([]);
  const [users, setUsers] = useState({});
  const [user, setUser] = useState({ cards: [] })

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
      <Board logic={logic} />
      <h2>{user.id}</h2>
      {/* <Hand  /> */}
    </div>
  )
}
