import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom';
import firebase from '../firebase';

import Board from '../components/Board';
import UI from '../components/UI';

import tokenService from '../util/tokenService';
import { defaultPaths, startingDeck } from '../game/gameDefault';
import { lines } from '../util/traffic';

const db = firebase.firestore();

//==================================================================================================================
//     START
//==================================================================================================================

export default function Game({ reload, load }) {

  const { id } = useParams();

  const [logic, setLogic] = useState({ paths: [] });
  const [users, setUsers] = useState({});
  const [user, setUser] = useState({ cards: [], dCards: [] })
  const [myTurn, setMyTurn] = useState(false);

  const history = useHistory();

  const destinations = [];
  user.dCards.forEach(d => {
    destinations.push(d.start);
    destinations.push(d.end);
  })

  //==================================================================================================================
  //        Rail functions
  //==================================================================================================================

  const handleClaimLine = async (outerKey, innerKey, taxis, other) => {
    if (!myTurn || logic.waiting || logic.moves > 0) return;

    try {
      let paths = { ...logic.paths };

      let hand = user.hand;
      let path = defaultPaths[outerKey][innerKey];

      if (paths[`${outerKey}-${innerKey}`] || other === user.color || taxis > user.taxis) return;

      // If its a grey path...

      if (path.color === 'grey') {

      } else {
        // Check you have the cards for it
        let noCards = hand.filter(x => x === path.color || x === 'wild').length < path.num;
        // Check if path is taken || the other line is taken by you || have enough taxis
        if (noCards) return

      }



      let routes = [...user.routes];
      routes.push(path.nodes.join('-'));
      paths[`${outerKey}-${innerKey}`] = user.color;

      //Discard cards used
      let discard = logic.discard ? [...logic.discard] : [];
      let num = path.num;
      for (let i = 0; i < num; i++) {
        let ind = hand.indexOf(path.color);
        if (ind >= 0) {
          discard.push(hand[ind]);
          hand.splice(ind, 1);
        } else {
          ind = hand.indexOf('wild');
          discard.push(hand[ind]);
          hand.splice(ind, 1);
        }
      }

      // Check if your destination cards are good
      let dCards = [];

      user.dCards.forEach(d => {
        if (d.connected) return dCards.push(d);
        let connected = (checkConnected(d.start, d.end, routes) || checkConnected(d.end, d.start, routes));
        dCards.push({
          ...d,
          connected: connected
        })
      })

      // Get points and change turn
      let points = convertPoints(taxis);
      let turn = logic.turn;
      turn++;
      turn = turn % logic.order.length;

      await Promise.all([
        db.collection(id).doc(user.id).update({ routes, taxis: user.taxis - taxis, points: user.points + points, dCards, hand }),
        db.collection(id).doc('logic').update({ paths, turn, discard })
      ])
      setMyTurn(false);
    } catch (err) {
      console.log(err);
    }
  }

  //==================================================================================================================
  //       Card functions
  //==================================================================================================================

  const dealStarterCards = async () => {
    let deck = [...logic.deck];

    //bring all users into one array
    let usersArr = [...users, user];

    //deal 4 cards each
    for (let i = 0; i < usersArr.length * 4; i++) {
      deal(usersArr[i % usersArr.length].hand)
    }

    // Deal the 5 starter face up cards
    let showing = []
    for (let i = 0; i < 5; i++) {
      deal(showing)
    }

    function deal(where) {
      let ind = Math.floor(Math.random() * deck.length);
      where.push(deck[ind]);
      deck.splice(ind, 1);
    }

    //save it to db
    await Promise.all(usersArr.map(u => db.collection(id).doc(u.id).update({ hand: u.hand })));
    await db.collection(id).doc('logic').update({ deck, showing, waiting: false })
  }

  const handleTakeFromDeck = async () => {
    if (!myTurn) return;
    let deck = [...logic.deck];
    let hand = user.hand ? [...user.hand] : [];
    let ind = Math.floor(Math.random() * deck.length);
    hand.push(deck[ind]);
    deck.splice(ind, 1);

    // Check and add moves
    let moves = logic.moves;
    moves++;

    // Change turn if necessary
    let turn = logic.turn;
    if (moves > 1) {
      turn++;
      turn = turn % logic.order.length;
      moves = 0;
      setMyTurn(false);
    }
    await Promise.all([db.collection(id).doc('logic').update({ deck, moves, turn }), db.collection(id).doc(user.id).update({ hand })]);
  }

  const handleTakeCard = async index => {
    if (!myTurn) return;
    let showing = [...logic.showing];
    let wild = showing[index] === 'wild';
    let moves = logic.moves;

    // If allready taken a card, cant take a wild
    if (wild && moves > 0) return

    let deck = [...logic.deck];
    let hand = [...user.hand];
    hand.push(showing[index]);
    let ind = Math.floor(Math.random() * deck.length);
    showing.splice(index, 1, deck[ind]);
    deck.splice(ind, 1);

    // Check and add move
    if (wild) {
      moves += 2;
    } else {
      moves++
    }

    // Change turn if necessary
    let turn = logic.turn;
    if (moves > 1) {
      console.log('here')
      turn++;
      turn = turn % logic.order.length;
      moves = 0;
      setMyTurn(false);
    }

    await Promise.all([db.collection(id).doc('logic').update({ deck, showing, moves, turn }), db.collection(id).doc(user.id).update({ hand })]);
  }

  const handleDiscard = async ind => {
    if (!myTurn) return;
    let discard = logic.discard ? [...logic.discard] : [];
    let hand = [...user.hand];
    discard.push(hand[ind]);
    hand.splice(ind, 1);
    await Promise.all([db.collection(id).doc('logic').update({ discard }), db.collection(id).doc(user.id).update({ hand })]);
  }

  const discardDCard = async ind => {
    let dCards = user.dCards;
    dCards.splice(ind, 1);
    await db.collection(id).doc(user.id).update({ dCards });
  }

  const handleAddCards = async () => {
    if (!myTurn) return;
    db.collection(id).doc('logic').update({ deck: startingDeck })
  }

  //=====================================================================================================================================

  useEffect(() => {
    const token = tokenService.getUserFromToken();
    if (!token) history.push('/');
    const unsubscribe = db.collection(id).onSnapshot(snap => {
      const connectedData = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      let logicData;
      let usersData = [];
      let userData = {};
      connectedData.forEach(data => {
        if (data.id === 'logic') {
          logicData = data;
        } else if (data.id === tokenService.getUserFromToken().username) {
          userData = data;
        } else {
          usersData.push(data);
        }
      });
      if (userData.color === logicData.order[logicData.turn]) setMyTurn(true);
      setUser(userData)
      setLogic(logicData);
      setUsers(usersData);
    })
    return () => {
      unsubscribe();
    }
  }, [load])

  return (
    <>
      <h1>Ticket to Ride - New York</h1>
      <div className="App">
        <Board
          logic={logic}
          handleClaimLine={handleClaimLine}
          color={user.color}
          destinations={destinations}
        />
        <UI
          waiting={logic.waiting}
          turn={myTurn}
          user={user}
          users={users}
          logic={logic}
          dealStarterCards={dealStarterCards}
          handleTakeFromDeck={handleTakeFromDeck}
          handleTakeCard={handleTakeCard}
          handleAddCards={handleAddCards}
          handleDiscard={handleDiscard}
          discardDCard={discardDCard}
        />
      </div>
    </>
  )
}


//================================================================================================================
//         HELPER FUNCTIONS
//================================================================================================================

function checkConnected(startingNode, endingNode, routes = []) {
  let usedPaths = []
  let answer = false;

  let myRoutes = [...routes]
  routes.forEach(r => myRoutes.push(r.split('-')[1] + '-' + r.split('-')[0]))

  if (!myRoutes.some(r => r.split('-').includes(startingNode)) || !myRoutes.some(r => r.split('-').includes(endingNode))) return false;

  test(startingNode)

  function test(newStart) {

    if (answer) return;

    let line = lines.find(l => l.node === newStart);
    let paths = line.connections.map(c => `${newStart}-${c}`).filter(p => myRoutes.includes(p) && !usedPaths.includes(p));
    if (paths.length < 1) return

    // push the first path [start]-[end] and [end]-[start] onto used list, so it wont be checked again
    usedPaths.push(paths[0]);
    usedPaths.push(paths[0].split('-')[1] + '-' + paths[0].split('-')[0]);

    //recursively check the next node on the list
    if (paths.some(p => p.split('-')[1] === endingNode)) return answer = true;
    paths.forEach(p => test(p.split('-')[1]));
  }

  return answer;
}

function convertPoints(num) {
  if (num < 3) {
    return num;
  } else if (num === 3) {
    return 4;
  } else {
    return 7
  }
}
