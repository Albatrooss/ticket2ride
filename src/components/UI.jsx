import React from 'react';
import '../styles/UI.css';

import CardsArea from './CardsArea';
import Hand from './Hand';
import OthersUI from './OthersUi';

export default function UI({
  waiting,
  turn,
  user,
  users,
  selectedCards,
  logic,
  dealStarterCards,
  handleTakeFromDeck,
  handleTakeCard,
  handleSelectCard,
  discardDCard,
  getReady,
  getMoreDCards,
  possibleDCards,
  keepNewDCard,
  discardNewDCard,
  passTurn
}) {

  return (
    <div className="ui">
      {waiting ? (user.host ?
        <div className="cards-area">
          <button onClick={dealStarterCards}>DEAL</button>
        </div> : '') :
        <CardsArea
          deck={logic.deck}
          waiting={logic.waiting}
          cardsShowing={logic.showing}
          dealStarterCards={dealStarterCards}
          handleTakeFromDeck={handleTakeFromDeck}
          handleTakeCard={handleTakeCard}
        />}

      {/* User area */}

      <h2>{user.id}
        {turn && !waiting && !user.done ? ' - Your Turn!' : ''}
        {logic.lastTurn && !user.done ? ' - Final Round!' : ''}</h2>

      {user.hand &&
        <Hand
          cards={user.hand.sort()}
          selectedCards={selectedCards}
          handleSelectCard={handleSelectCard}
        />}

      {/* Destination cards*/}

      <ul className="ui-d-list">
        {user.dCards && user.dCards.map((d, i) => <li key={`${d.start}-${d.end}`}>
          <div className={`${d.connected ? 'connected' : ''}`}>
            <p>{d.start}<span>-to-</span>{d.end}</p>
            <span className="points">{d.points}</span>
            <div className="dcard-hover"><p>{d.connected ? `You did it! Enjoy your ${d.points} points!` : `Destination Card: Connect ${d.start} to ${d.end} and get ${d.points} points!`}</p></div>
          </div>
          {waiting && !user.ready && user.dCards.length > 1 && <button onClick={() => discardDCard(i)}>Discard</button>}</li>)}
        {waiting && !user.ready && <li className="ready-btn"><button onClick={getReady}>Ready!</button></li>}
        {possibleDCards && possibleDCards.map((p, i) => <li key={`${p.start}-${p.end}`} className='possible-d'>
          <div>
            <p>{p.start}<span>-to-</span>{p.end}</p>
            <span className="points">{p.points}</span>
          </div>
          <div className='dCard-buttons'>
            <button onClick={() => keepNewDCard(i)}>Keep</button>
            <button onClick={() => discardNewDCard(i)}>Discard</button>
          </div>
        </li>)}
      </ul>


      <div className='points-taxis'>
        <div className="dCard-more"><button onClick={getMoreDCards}>More<br />Destination Cards</button><div className="dcard-hover"><p>Click here to get 2 more Destination Cards, you can discard only one!</p></div></div>
        <div className="my-taxis">
          <div className="taxi" style={{ backgroundColor: user.color }}></div>
          <p>{user.taxis}</p>
        </div>
        <div className="my-points">
          Points:
          <span>{user.points}</span>
        </div>
        <button onClick={passTurn}>Pass</button>
      </div>
      <OthersUI users={users} />
    </div>
  )
}
