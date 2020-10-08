import React from 'react';
import '../styles/UI.css';

import CardsArea from './CardsArea';
import Hand from './Hand';

export default function UI({ waiting, turn, user, users, selectedCards, logic, dealStarterCards, handleTakeFromDeck, handleTakeCard, handleAddCards, handleSelectCard, discardDCard }) {
  return (
    <div className="ui">
      {waiting ? (user.host ?
        <div className="cards-area">
          <button onClick={dealStarterCards}>DEAL</button>
        </div> : '') :
        <CardsArea
          waiting={logic.waiting}
          cardsShowing={logic.showing}
          dealStarterCards={dealStarterCards}
          handleTakeFromDeck={handleTakeFromDeck}
          handleTakeCard={handleTakeCard}
        />}

      {/* User area */}

      <h2>{user.id}</h2>
      {turn && !waiting ? <h3>YOUR TURN!</h3> : ''}

      {user.hand &&
        <Hand
          cards={user.hand.sort()}
          selectedCards={selectedCards}
          handleSelectCard={handleSelectCard}
        />}

      {waiting && <h3>Pick your Destination Cards</h3>}
      {/* Destination cards*/}

      < ul className="ui-d-list" >
        {user.dCards && user.dCards.map((d, i) => <li key={`${d.start}${i}`}>
          <div className={`${d.connected ? 'connected' : ''}`}>
            {d.start}
            <br />-to-<br />
            {d.end}
          </div>
          {waiting && user.dCards.length > 1 && <button onClick={() => discardDCard(i)}>Discard</button>}</li>)}
      </ul>
      <div>
        <img className="taxi-icon" src="/images/Taxi_Icon.png" alt="taxis" />
        <p>{user.taxis}</p>
      </div>
      <button onClick={handleAddCards}>ADD CArDS</button>
    </div>
  )
}
