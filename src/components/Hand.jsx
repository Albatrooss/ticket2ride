import React from 'react'
import '../styles/cards.css';

export default function Hand({ cards, selectedCards, handleSelectCard }) {

  let width = `${cards ? 12 + (cards.length * 5) : 12}%`;

  return (
    <div className="hand-container">
      {cards && <ul className="hand">
        {cards.map((card, i) => (
          <li><div className={`card ${card} ${selectedCards.some(x => x === i) ? 'card-selected' : ''}`} onClick={() => handleSelectCard(i)}><p>{card}</p></div></li>
        ))}
      </ul>}
    </div>
  )
}
