import React from 'react'
import '../styles/cards.css';

export default function Hand({ cards, selectedCards, handleSelectCard }) {

  return (
    <div className="hand-container">
      {cards && <ul className="hand">
        {cards.map((card, i) => (
          <li key={`${card}${i}`}><div className={`card ${card} ${selectedCards.some(x => x === i) ? 'card-selected' : ''}`} onClick={() => handleSelectCard(i)}><p>{card}</p></div></li>
        ))}
      </ul>}
    </div>
  )
}
