import React from 'react'
import '../styles/cards.css';

import { cards } from '../game/gameDefault';

export default function Hand({ player }) {

  const myCards = player.cards.map((card, i) => (
    <div style={{ left: `${i * 5}%` }} className={`card ${cards[card].color}`}>{cards[card].symbol}</div>
  ))

  return (
    <div className="hand-container">
      <h2>{player.name}</h2>
      <div className="hand">
        {myCards}
      </div>
    </div>
  )
}
