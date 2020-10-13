import React from 'react'

export default function CardsArea({ deck, waiting, cardsShowing, dealStarterCards, handleTakeFromDeck, handleTakeCard }) {


  return (
    <div className="cards-area">
      <ul>
        <li className="card deck" onClick={handleTakeFromDeck}>{deck.length > 1 ? <p>Ticket<br />To<br />Ride</p> : <p>No More Cards</p>}</li>
        <li className="buffer"></li>
        {cardsShowing && cardsShowing.map((c, i) => <li key={c + i}><div className={`card ${c}`} onClick={() => handleTakeCard(i)}><p>{c}</p></div></li>)}
      </ul>
    </div>
  )
}
