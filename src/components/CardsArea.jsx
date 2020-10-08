import React from 'react'

export default function CardsArea({ waiting, cardsShowing, dealStarterCards, handleTakeFromDeck, handleTakeCard }) {


  return (
    <div className="cards-area">
      <ul>
        <li className="card deck" onClick={handleTakeFromDeck}><p>Ticket<br />To<br />Ride<br />NYC</p></li>
        <li className="buffer"></li>
        {cardsShowing && cardsShowing.map((c, i) => <li key={c + i}><div className={`card ${c}`} onClick={() => handleTakeCard(i)}><p>{c}</p></div></li>)}
      </ul>
    </div>
  )
}
