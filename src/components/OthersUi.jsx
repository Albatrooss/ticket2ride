import React from 'react'

export default function OthersUi({ users }) {

  return (
    <ul className="other-ui">
      {users.map(user => <li key={user.id}>
        {user.id}
        <div>
          <span>C: {user.hand.length}</span>
          <span>D: {user.dCards.length}</span>
          <span>T: {user.taxis}</span>
        </div>
      </li>)}
    </ul>
  )
}
