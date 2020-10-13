import React, { useState, useEffect } from 'react'
import OthersUi from '../components/OthersUi';
import firebase from '../firebase';

const db = firebase.firestore();

export default function Test() {

  const [loading, setLoading] = useState(true);
  const [num, setNum] = useState(0);

  useEffect(() => {
    let fetch = async () => {
      let unModifiedList = [];
      let addedNum = 0;
      let collections = await (await db.collection('lobbyList').doc('list').get()).data().list;
      for await (let collection of collections) {
        let docs = await db.collection(collection).get().then(res => res.docs);
        let logic = docs.filter(doc => doc.id === 'logic');
        if (logic.length > 0) {
          logic = logic[0].data();
          if (new Date(logic.lastModified).getDate() !== new Date(Date.now()).getDate()) {
            addedNum++;
            console.log('ADSFADF', addedNum);
            docs.forEach(async doc => {
              await db.collection(collection).doc(doc.id).delete();
            });
          } else {
            unModifiedList.push(collection);
          }
        } else {
        }
      }
      return { unModifiedList, addedNum };
    }
    fetch().then(res => {
      console.log('here', res)
      db.collection('lobbyList').doc('list').set({ list: res.unModifiedList });
      setNum(res.addedNum)
      setLoading(false);
    });
  }, [])
  return loading ? (
    <div>
      LOADING...
    </div>
  ) : (
      <div>
        Done!<br /> Deleted {num} Game{num === 1 ? '' : 's'}
      </div>
    )
}
