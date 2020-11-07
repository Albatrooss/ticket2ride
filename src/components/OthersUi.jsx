import React from 'react'

export default function OthersUi({ users }) {

  return (
    <ul className="other-ui">
      {users.map(user => <li key={user.id}>
        {user.id}
        <div>
          <div><div className="card-symbol">T</div><p>: {user.hand.length}</p><div className="card-hover"><p>The number of regular cards in your opponent's hand</p></div></div>
          <div><div className="card-symbol dest">D</div><p>: {user.dCards.length}</p><div className="card-hover"><p>The number of destinations cards in your opponent's hand</p></div></div>
          <div><div className="taxi symbol" style={{ backgroundColor: user.color }} /><p>: {user.taxis}</p><div className="card-hover"><p>The number of taxis pieces your opponent has left to play</p></div></div>
        </div>
      </li>)}
    </ul>
  )
}
