import React from 'react'

export default function CardsArea({ deck, waiting, cardsShowing, dealStarterCards, handleTakeFromDeck, handleTakeCard }) {


  return (
    <div className="cards-area">
      <ul>
        <li className="card deck" onClick={handleTakeFromDeck}>{deck.length > 1 ? <p>Ticket<br />To<br />Ride</p> : <p>No More Cards</p>}</li>
        <li className="buffer"></li>
        {cardsShowing && cardsShowing.map((c, i) => (
          c === "wild" ? <li key={c + i}><div className={`card ${c}`} onClick={() => handleTakeCard(i)}>
            <p>{c}</p>
            <div className="w-card green" />
            <div className="w-card blue" />
            <div className="w-card red" />
            <div className="w-card black" />
            <div className="w-card pink" />
            <div className="w-card green" />
            <div className="w-card orange" />
          </div>
          </li> :
            <li key={c + i}><div className={`card ${c}`} onClick={() => handleTakeCard(i)}>
              <p>{c}</p>
            </div>
            </li>)
        )}
      </ul>
    </div>
  )
}
