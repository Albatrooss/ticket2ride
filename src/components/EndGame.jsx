import React from 'react'

export default function EndGame({ users }) {

  let sorted = users.sort((a, b) => b.points - a.points)
  return (
    <ul>
      {sorted.map((u, i) => <li key={u.id}>{place(i)}{u.id} - {u.points} points</li>)}
    </ul>
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