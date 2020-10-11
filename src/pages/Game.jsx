import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom';
import '../styles/game.css';

import firebase from '../firebase';

import Board from '../components/Board';
import UI from '../components/UI';
import EndGame from '../components/EndGame';

import tokenService from '../util/tokenService';
import { defaultPaths, startingDeck, lines, defaultTokens } from '../game/gameDefault';

const db = firebase.firestore();

//==================================================================================================================
//     START
//==================================================================================================================

export default function Game({ reload, load }) {

  const { id } = useParams();

  const [logic, setLogic] = useState({ paths: [] });
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({ cards: [], dCards: [] })
  const [myTurn, setMyTurn] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);
  const [possibleDCards, setPossibleDCards] = useState([]);

  const history = useHistory();

  const destinations = [];
  user.dCards.forEach(d => {
    destinations.push(d.start);
    destinations.push(d.end);
  })

  //==================================================================================================================
  //        Rail functions
  //==================================================================================================================

  const handleClaimLine = async (outerKey, innerKey, other) => {
    if (!myTurn || logic.waiting || logic.moves > 0) return;

    try {
      let paths = { ...logic.paths };

      let hand = user.hand;
      let path = defaultPaths[outerKey][innerKey];
      let numberOfTaxis = path.num;

      // Check if path is taken || the other line is taken by you || you have enough taxis
      if (paths[`${outerKey}-${innerKey}`] || other === user.color || numberOfTaxis > user.taxis) return;


      // Check you have selected the cards for it\
      if (selectedCards.length < numberOfTaxis) return

      let routes = [...user.routes];
      routes.push(path.nodes.join('-'));
      paths[`${outerKey}-${innerKey}`] = user.color;

      //Discard cards used
      let discard = logic.discard ? [...logic.discard] : [];
      let newHandFilter = []
      let txi = numberOfTaxis;
      selectedCards.forEach(ind => {
        if (txi > 0) {
          discard.push(hand[ind]);
          newHandFilter.push(ind);
          txi--;
        }
      })
      hand = hand.filter((x, i) => !newHandFilter.includes(i))

      // Check if your destination cards are good
      let dCards = [];
      let dCardPoints = 0;
      user.dCards.forEach(d => {
        if (d.connected) return dCards.push(d);
        let connected = (checkConnected(d.start, d.end, routes) || checkConnected(d.end, d.start, routes));
        // Get points if connected
        if (connected) {
          dCardPoints = d.points;
        }
        dCards.push({
          ...d,
          connected: connected
        })
      })

      // Get points for tokens;

      let tokenList = defaultTokens.filter(t => t.points).map(t => t.name);

      let myPlaces = [];
      user.routes.forEach(r => {
        let split = r.split('-');
        myPlaces.push(split[0]);
        myPlaces.push(split[1]);
      })
      console.log(path.nodes[0]);
      console.log(path.nodes[1]);
      if (tokenList.filter(t => !myPlaces.includes(t)).includes(path.nodes[0])) {
        dCardPoints++;
      }
      if (tokenList.filter(t => !myPlaces.includes(t)).includes(path.nodes[1])) {
        dCardPoints++;
      }

      // Get points, taxis and change turn, finish if last turn
      let points = convertPoints(numberOfTaxis);
      points += user.points + dCardPoints;

      let taxis = user.taxis - numberOfTaxis;
      console.log(user.taxis, numberOfTaxis, taxis)

      let turn = logic.turn;
      turn++;
      turn = turn % logic.order.length;

      let lastTurn = logic.lastTurn ? logic.lastTurn : taxis < 3;

      // Send to DB
      await Promise.all([
        db.collection(id).doc(user.id).update({ routes, taxis, points, dCards, hand, done: logic.lastTurn }),
        db.collection(id).doc('logic').update({ paths, turn, discard, lastTurn, lastModified: Date.now() })
      ])

      //Reset locally
      setSelectedCards([]);
      setMyTurn(false);
    } catch (err) {
      console.log(err);
    }
  }

  //==================================================================================================================
  //       Card functions
  //==================================================================================================================

  const dealStarterCards = async () => {
    if (users.some(user => !user.ready)) return;
    let deck = [...logic.deck];

    //bring all users into one array
    let usersArr = [...users, user];

    //deal 4 cards each
    for (let i = 0; i < usersArr.length * 4; i++) {
      deal(usersArr[i % usersArr.length].hand)
    }

    // Deal the 5 starter face up cards
    let showing = logic.showing || [];
    let interval = setInterval(dealToShowing, 500);
    let cardsDealt = 0

    async function dealToShowing() {
      cardsDealt++;
      if (cardsDealt > 5) {
        clearInterval(interval);
        return;
      }
      deal(showing);
      await db.collection(id).doc('logic').update({ showing });
    }

    function deal(where) {
      let ind = Math.floor(Math.random() * deck.length);
      where.push(deck[ind]);
      deck.splice(ind, 1);
    }

    //save it to db
    await Promise.all(usersArr.map(u => db.collection(id).doc(u.id).update({ hand: u.hand })));
    await db.collection(id).doc('logic').update({ deck, waiting: false })
  }

  const handleTakeFromDeck = async () => {
    let deck = [...logic.deck];
    let discard = [...logic.discard];
    if (deck.length < 1 && discard.length < 1) {
      alert('Out of Cards!')
      return;
    }
    if (!myTurn) return;
    if (deck.length < 1) {
      deck = discard;
      discard = [];
    }
    let hand = user.hand ? [...user.hand] : [];
    let ind = Math.floor(Math.random() * deck.length);
    hand.push(deck[ind]);
    deck.splice(ind, 1);

    // Check and add moves
    let moves = logic.moves;
    moves++;

    // Change turn if necessary
    let turn = logic.turn;
    let turnOver = false;

    if (moves > 1) {
      turn++;
      turn = turn % logic.order.length;
      moves = 0;
      turnOver = true;
    }
    await Promise.all([
      db.collection(id).doc(user.id).update({ hand }),
      db.collection(id).doc('logic').update({ deck, discard, moves, turn })
    ]);

    if (turnOver) setMyTurn(false);
  }

  const handleTakeCard = async index => {
    if (!myTurn) return;
    let showing = [...logic.showing];
    let wild = showing[index] === 'wild';
    let moves = logic.moves;

    // If allready taken a card, cant take a wild
    if (wild && moves > 0) return

    let deck = [...logic.deck];
    let discard = [...logic.discard]; // Check there are cards in the deck, if not replace with the discarded cards
    if (deck.length < 1) {
      deck = discard;
      discard = [];
    }
    let hand = [...user.hand];
    hand.push(showing[index]);
    let ind = Math.floor(Math.random() * deck.length);
    if (deck.length > 0) {
      showing.splice(index, 1, deck[ind]);
      deck.splice(ind, 1);
    } else {
      showing.splice(index, 1)
    }

    // Check how many wild cards are showing

    if (showing.filter(c => c === 'wild').length > 2 && [...deck, ...discard].length > 4) {

      discard = [...discard, ...showing];
      showing = [];
      await db.collection(id).doc('logic').update({ showing });

      let interval = setInterval(dealToShowing, 500);
      let cardsDealt = 0

      async function dealToShowing() {
        cardsDealt++;
        if (cardsDealt > 5) {
          clearInterval(interval);
          return;
        }
        deal(showing);
        await db.collection(id).doc('logic').update({ showing });
      }
    }

    function deal(where) {
      if (deck.length < 1) {
        deck = discard;
        discard = [];
      }
      if (deck.length > 0) {
        let ind = Math.floor(Math.random() * deck.length);
        where.push(deck[ind]);
        deck.splice(ind, 1);
      }
    }

    // Check and add move
    if (wild) {
      moves += 2;
    } else {
      moves++
    }

    // Change turn if necessary
    let turn = logic.turn;
    let turnOver = false;
    if (moves > 1) {
      turn++;
      turn = turn % logic.order.length;
      moves = 0;
      turnOver = true;
    }

    await Promise.all([
      db.collection(id).doc(user.id).update({ hand }),
      db.collection(id).doc('logic').update({ deck, discard, showing, moves, turn })
    ]);

    if (turnOver) setMyTurn(false);
  }

  const handleSelectCard = index => {
    let prev = [...selectedCards];
    // Can only use one Wild Card
    if (prev.some(x => user.hand[x] === 'wild') && user.hand[index] === 'wild') return;
    // If empty or wild push 
    if (prev.length < 1 || user.hand[index] === 'wild') {
      prev.push(index);
    } else if (prev.includes(index)) { // If click the same, deselect
      let ind = prev.indexOf(index);
      prev.splice(ind, 1);
    } else if (user.hand[prev[0]] === 'wild') { // If the first is wild, push if only card, compare to second if longer
      if (prev.length === 1) {
        prev.push(index);
      } else {
        let thisColor = user.hand[prev[1]];
        if (thisColor !== user.hand[index]) {
          prev = [index];
        } else {
          prev.push(index);
        }
      }
    } else {
      let thisColor = user.hand[prev[0]];
      if (thisColor !== user.hand[index]) {
        prev = [index];
      } else {
        prev.push(index);
      }
    }
    setSelectedCards(prev)
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
    let dCards = [user.dCards];
    dCards.splice(ind, 1);
    await db.collection(id).doc(user.id).update({ dCards });
  }

  const keepNewDCard = async ind => {
    let possible = [...possibleDCards];
    let dCards = [...user.dCards];

    dCards.push(possible[ind]);
    possible.splice(ind, 1);
    setPossibleDCards(possible);
    await db.collection(id).doc(user.id).update({ dCards });
  }

  const discardNewDCard = async ind => {
    let dCards = [...possibleDCards];
    dCards.splice(ind, 1);
    setPossibleDCards(dCards);
  }

  const handleAddCards = async () => {
    if (!myTurn) return;
    db.collection(id).doc('logic').update({ deck: startingDeck })
  }

  const getMoreDCards = async () => {
    let allDCards = [...logic.destinations];
    let newDCards = [];
    getDCard();
    getDCard();

    function getDCard() {
      let options = allDCards.filter(x => !x.taken);
      if (options.length < 1) return;
      let ind = Math.floor(Math.random() * options.length)
      newDCards.push(options[ind]);
      allDCards.find(x => (x.start === options[ind].start && x.end === options[ind].end)).taken = true;
    }
    setPossibleDCards(newDCards);
    await db.collection(id).doc('logic').update({ destinations: allDCards })
  }

  //=====================================================================================================================================
  //  GAME STATES
  //=====================================================================================================================================

  const getReady = async () => {
    await db.collection(id).doc(user.id).update({ ready: true });
  }

  //=====================================================================================================================================

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
  }, [load, id, history])

  return (
    <main className="main-game">
      <h1>Ticket to Ride - New York</h1>
      <div className="game">
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
          selectedCards={selectedCards}
          users={users}
          logic={logic}
          dealStarterCards={dealStarterCards}
          handleTakeFromDeck={handleTakeFromDeck}
          handleTakeCard={handleTakeCard}
          handleSelectCard={handleSelectCard}
          handleAddCards={handleAddCards}
          handleDiscard={handleDiscard}
          discardDCard={discardDCard}
          getReady={getReady}
          getMoreDCards={getMoreDCards}
          possibleDCards={possibleDCards}
          keepNewDCard={keepNewDCard}
          discardNewDCard={discardNewDCard}
        />
      </div>
      {user.done && users.every(u => u.done) && <EndGame users={[...users, user]} />}
    </main>
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