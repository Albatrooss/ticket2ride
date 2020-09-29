import React, { useState } from 'react';
import '../styles/rails.css';

function convertPoints(num) {
  if (num < 3) {
    return num;
  } else if (num === 3) {
    return 4;
  } else {
    return 7
  }
}

function Line({ data, outerKey, innerKey, handleClaimLine }) {

  const [hovered, setHovered] = useState(false);

  const squares = () => {
    let resp = [];
    for (let i = 0; i < data.num; i++) {
      resp.push(<div key={i} className={`square ${data.color} ${hovered ? 'hovered' : ''}`}>{data.taken ? <div className={`taxi ${data.taken}`}></div> : ''}</div>)
    }
    return resp;
  }

  return (
    <div className="line" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={() => handleClaimLine(outerKey, innerKey, convertPoints(data.num))}>
      {squares()}
    </div>
  )
}

export default function Rail({ data, myKey, handleClaimLine }) {

  const lines = data.map((line, i) => <Line data={line} outerKey={myKey} innerKey={i} handleClaimLine={handleClaimLine} />)

  return (
    <div key={myKey} className={`rail rail-${myKey}`}>
      {lines}
    </div>
  )
}
