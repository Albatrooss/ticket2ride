import React, { useState, useEffect } from 'react'
import firebase from '../firebase';

const db = firebase.firestore();

export default function Test() {

  const [allCollections, setAllCollections] = useState([]);


  const click = async () => {
    let check = await db.collection('first').get();
    console.log(check.docs.length)
  }

  const del = async () => {
    let g = await db.collection('first').get();
    let ids = g.docs.map(x => x.id);
    ids.forEach(async x => await db.collection('first').doc(x).delete())
  }

  useEffect(() => {
    let fetch = async () => {
      let collections = await db.collection('lobbyList').doc('list').get();
      console.log(collections.data().list);
      setAllCollections(collections.data().list);
    }
    fetch();
  }, [])
  return (
    <div>
      <button onClick={click}>CLICK</button>
      <button onClick={del}>DELETE</button>

    </div>
  )
}
