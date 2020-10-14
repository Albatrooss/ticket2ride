import React, { useState, useEffect, useRef } from 'react'
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
  const dbRef = db.collection(id);

  const [logic, setLogic] = useState({ paths: [], deck: [] });
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({ cards: [], dCards: [] })
  const [myTurn, setMyTurn] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);
  const [possibleDCards, setPossibleDCards] = useState([]);

  const history = useHistory();
  const soundRefs = [useRef(null), useRef(null), useRef(null)];

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

      let rightCards = false;

      if (hand.filter((x, i) => selectedCards.includes(i)).includes(path.color) || path.color === 'grey') rightCards = true;

      // Check if path is taken || the other line is taken by you || you have enough taxis || wrong color
      if (paths[`${outerKey}-${innerKey}`] || other === user.color || numberOfTaxis > user.taxis || !rightCards) return;


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

      let myTokens = user.tokens ? [...user.tokens] : [];

      if (tokenList.filter(t => !myPlaces.includes(t)).includes(path.nodes[0])) {
        dCardPoints++;
        myTokens.push(path.nodes[0]);
      }
      if (tokenList.filter(t => !myPlaces.includes(t)).includes(path.nodes[1])) {
        dCardPoints++;
        myTokens.push(path.nodes[1]);
      }

      // Get points, taxis and change turn, finish if last turn
      let points = convertPoints(numberOfTaxis);
      points += user.points + dCardPoints;

      let taxis = user.taxis - numberOfTaxis;

      let turn = logic.turn;
      turn++;
      turn = turn % logic.order.length;

      soundRefs[2].current.volume = 0.2;
      soundRefs[2].current.play();
      soundRefs[1].current.play();

      let lastTurn = logic.lastTurn ? logic.lastTurn : taxis < 3;

      // Send to DB
      await updateDB({ paths, turn, discard, lastTurn, lastModified: Date.now() }, { routes, taxis, points, tokens: myTokens, dCards, hand, done: logic.lastTurn })

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

    //bring all users into one array
    let usersArr = [...users, user];
    let deck = [...logic.deck];

    if (users.some(user => !user.ready)) return; // Return if someone isn't ready

    //deal 4 cards each
    for (let i = 0; i < usersArr.length * 4; i++) {
      deal(usersArr[i % usersArr.length].hand, deck)
    }

    // Deal the 5 starter face up cards
    let showing = logic.showing || [];
    let dealInterval = setInterval(dealToShowing, 500);
    let cardsDealt = 0
    let soundRef = 0;

    async function dealToShowing() {
      cardsDealt++;
      if (cardsDealt > 5) {
        clearInterval(dealInterval);
        return;
      }
      deal(showing, deck);
      soundRefs[soundRef].current.play();
      soundRef = soundRef ? 0 : 1;
      await updateDB({ showing }, null);
    }

    //save it to db
    await Promise.all(usersArr.map(async u => await db.collection(id).doc(u.id).update({ hand: u.hand })));
    await updateDB({ deck, waiting: false }, null);
  }

  const handleTakeFromDeck = async () => {
    let deck = [...logic.deck];
    let discard = [...logic.discard];

    if (!myTurn) return;

    if (deck.length < 1 && discard.length < 1) { // Check there are cards in the deck or discard
      alert('Out of Cards!')
      return;
    }
    if (deck.length < 1) { // Put used cards back in the deck if deck is empty
      deck = discard;
      discard = [];
    }
    // Put random card from deck into hand, remove from deck
    let hand = user.hand ? [...user.hand] : [];

    deal(hand, deck);

    // Play deal noise
    soundRefs[0].current.play();

    // Check and add moves
    let moves = logic.moves;
    moves++;

    // Change turn if necessary
    let turn = logic.turn;
    let turnOver = false;
    let done = false;

    if (moves > 1) { // The player gets to take 2 cards, unless the card is wild;
      turn++;
      turn = turn % logic.order.length;
      moves = 0;
      turnOver = true;
      done = logic.lastTurn;
    }
    await updateDB({ deck, discard, moves, turn }, { hand, done });

    if (turnOver) setMyTurn(false);
  }

  const handleTakeCard = async index => {
    if (!myTurn) return;
    let showing = [...logic.showing];
    let wild = showing[index] === 'wild';
    let moves = logic.moves;
    let deck = [...logic.deck];
    let discard = [...logic.discard];
    let hand = [...user.hand];

    // If allready taken a card, cant take a wild
    if (wild && moves > 0) return

    // Check there are cards in the deck, if not replace with the discarded cards
    if (deck.length < 1) {
      deck = discard;
      discard = [];
    }

    // Push card into hand and play noise
    hand.push(showing[index]);
    soundRefs[0].current.play();

    let ind = Math.floor(Math.random() * deck.length); // Take random card from deck and display face up, if there is a card to use
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
      let soundRef = 0;

      async function dealToShowing() {
        cardsDealt++;
        if (cardsDealt > 5) {
          clearInterval(interval);
          return;
        }
        deal(showing, deck);
        soundRefs[soundRef].current.play();
        soundRef = soundRef ? 0 : 1
        await updateDB({ showing }, null);
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
    let done = false;
    if (moves > 1) {
      turn++;
      turn = turn % logic.order.length;
      moves = 0;
      turnOver = true;
      done = logic.lastTurn;
    }

    await updateDB({ deck, discard, showing, moves, turn }, { hand, done });

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

  // const handleDiscard = async ind => {
  //   if (!myTurn) return;
  //   let discard = logic.discard ? [...logic.discard] : [];
  //   let hand = [...user.hand];
  //   discard.push(hand[ind]);
  //   hand.splice(ind, 1);
  //   await Promise.all([db.collection(id).doc('logic').update({ discard }), db.collection(id).doc(user.id).update({ hand })]);
  // }

  const discardDCard = async ind => {
    let dCards = [user.dCards];
    dCards.splice(ind, 1);
    await updateDB(null, { dCards });
  }

  const keepNewDCard = async ind => {
    let possible = [...possibleDCards];
    let dCards = [...user.dCards];
    let turn = logic.turn;

    dCards.push(possible[ind]);
    possible.splice(ind, 1);
    setPossibleDCards(possible);

    // Check if new card is allready good!
    let checkedDCards = [];
    let dCardPoints = 0;
    dCards.forEach(d => {
      if (d.connected) return checkedDCards.push(d);
      let connected = (checkConnected(d.start, d.end, user.routes) || checkConnected(d.end, d.start, user.routes));
      // Get points if connected
      if (connected) {
        dCardPoints = d.points;
      }
      checkedDCards.push({
        ...d,
        connected: connected
      })
    })

    // Change turn if necessary
    let myTurn = true;
    let done = false
    if (possible.length < 1) {
      turn++;
      turn = turn % logic.order.length;
      myTurn = false;
      done = logic.lastTurn
    }
    await updateDB({ turn, points: user.points + dCardPoints }, { dCards: checkedDCards, done });
    setMyTurn(myTurn);
  }

  const discardNewDCard = async ind => {
    let possibledCards = [...possibleDCards];
    possibledCards.splice(ind, 1);
    setPossibleDCards([]);

    soundRefs[0].current.play();
    // Change turn if necessary\

    let turn = logic.turn;
    turn++;
    turn = turn % logic.order.length;
    let points = user.points;
    let dCards = [...user.dCards];
    if (possibledCards.length > 0) {
      let d = possibleDCards[0];
      let connected = (checkConnected(d.start, d.end, user.routes) || checkConnected(d.end, d.start, user.routes));
      if (connected) {
        d = { ...d, connected: true };
        points += d.points;
      }

      dCards.push(d);
    }

    await updateDB({ turn }, { dCards, points, done: logic.lastTurn });
    setMyTurn(false);
  }

  const handleAddCards = async () => {
    if (!myTurn) return;
    db.collection(id).doc('logic').update({ deck: startingDeck })
  }

  const getMoreDCards = async () => {
    if (logic.moves > 0) return;
    let allDCards = [...logic.destinations];
    if (allDCards.filter(x => !x.taken).length < 1) return alert('No more Destination Cards!');
    let newDCards = [];
    let soundRef = 0;
    getDCard();
    await setTimeout(getDCard, 500);

    function getDCard() {
      let options = allDCards.filter(x => !x.taken);
      if (options.length < 1) return;
      let ind = Math.floor(Math.random() * options.length)
      soundRefs[soundRef].current.play();
      soundRef = soundRef ? 0 : 1
      newDCards.push(options[ind]);
      let takenCard = allDCards.find(x => (x.start === options[ind].start && x.end === options[ind].end))
      takenCard.taken = true;
    }
    await setTimeout(async () => {
      console.log('updated DB');
      await updateDB({ destinations: allDCards }, null)
      setPossibleDCards(newDCards)
    }, 600);
  }

  //=====================================================================================================================================
  //  GAME STATES
  //=====================================================================================================================================

  const getReady = async () => {
    await db.collection(id).doc(user.id).update({ ready: true });
  }

  const newGame = async () => {
    // await db.collection(id).doc('logic').delete();
    // await db.collection(id).doc(user.id).delete();
    // users.forEach(async u => await db.collection(id).doc(u.id).delete());
    history.push('/');
  }

  const passTurn = async () => {
    if (!myTurn) return
    let turn = logic.turn;
    turn++;
    turn = turn % logic.order.length;
    await updateDB({ turn }, { done: logic.lastTurn })
    setMyTurn(false);
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


  async function updateDB(logicUpdate, userUpdate) {
    if (logicUpdate) dbRef.doc('logic').update(logicUpdate);
    if (userUpdate) dbRef.doc(user.id).update(userUpdate);
  }

  return (
    <main className="main-game">
      <h1>Ticket to Ride - New York</h1>
      <div className="game">
        <Board
          logic={logic}
          handleClaimLine={handleClaimLine}
          color={user.color}
          destinations={destinations}
          myTokens={user.tokens}
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
          // handleDiscard={handleDiscard}
          discardDCard={discardDCard}
          getReady={getReady}
          getMoreDCards={getMoreDCards}
          possibleDCards={possibleDCards}
          keepNewDCard={keepNewDCard}
          discardNewDCard={discardNewDCard}
          passTurn={passTurn}
        />
      </div>
      {user.done && users.every(u => u.done) && <EndGame newGame={newGame} users={[...users, user]} />}
      <audio src="/sounds/deal01.wav" ref={soundRefs[0]}></audio>
      <audio src="/sounds/deal01.wav" ref={soundRefs[1]}></audio>
      <audio src="/sounds/honk01.wav" ref={soundRefs[2]}></audio>
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

function deal(where, deck) {
  if (deck.length > 0) {
    let ind = Math.floor(Math.random() * deck.length);
    where.push(deck[ind]);
    deck.splice(ind, 1);
  } else {
    console.log('Deck is empty..')
  }
}