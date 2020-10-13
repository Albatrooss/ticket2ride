import React from 'react'
import '../styles/endgame.css'

export default function EndGame({ users, newGame }) {

  let sorted = users.sort((a, b) => b.points - a.points)
  return (
    <div className="end-game">
      <div>
        <h2>Game Over!</h2>
        <ul>
          {sorted.map((u, i) => <li key={u.id}>{place(i)}{u.id} <span> </span> {u.points} points</li>)}
        </ul>
        <button onClick={newGame}>Play Again?</button>
      </div>
    </div>
  )
}


function place(num) {
  let ans = '';
  switch (num) {
    case 0:
      ans = 'First Place: ';
      break;
    case 1:
      ans = 'Second Place: ';
      break;
    case 2:
      ans = 'Third Place: ';
      break;
    case 3:
      ans = 'Fourth Place: ';
      break;
    default:
      ans = 'Fifth Place'
  }
  return ans;
}