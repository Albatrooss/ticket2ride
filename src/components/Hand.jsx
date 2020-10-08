import React from 'react'
import '../styles/cards.css';

export default function Hand({ cards, handleDiscard }) {

  let width = `${cards ? 12 + (cards.length * 5) : 12}%`;

  return (
    <div className="hand-container">
      {cards && <ul className="hand">
        {cards.map((card, i) => (
          <li><div className={`card ${card}`} onClick={() => handleDiscard(i)}><p>{card}</p></div></li>
        ))}
      </ul>}
    </div>
  )
}
