import React, { useState } from 'react';
import '../styles/rails.css';

function Line({ data }) {

  const [hovered, setHovered] = useState(false);

  const squares = () => {
    let resp = [];
    for (let i = 0; i < data.num; i++) {
      resp.push(<div key={i} className={`square ${data.color} ${hovered ? 'hovered' : ''}`}>{data.taken ? <div className={`taxi ${data.taken}`}></div> : ''}</div>)
    }
    return resp;
  }

  return (
    <div className="line" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {squares()}
    </div>
  )
}

export default function Rail({ data, myKey }) {

  const lines = data.map((line, i) => <Line data={line} key={i} />)

  return (
    <div key={myKey} className={`rail rail-${myKey}`}>
      {lines}
    </div>
  )
}
