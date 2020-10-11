import React, { useState } from 'react';
import '../styles/rails.css';

function Line({ data, outerKey, innerKey, handleClaimLine, color, other }) {

  const [hovered, setHovered] = useState(false);

  const squares = () => {
    let resp = [];
    for (let i = 0; i < data.num; i++) {
      resp.push(<div key={i} className={`square ${data.color}`}>{data.taken ? <div className={`taxi ${data.taken}`} /> : ''}{!data.taken && other.taken !== color && hovered ? <div className={`hovered-taxi ${color}`} /> : ''}</div>)
    }
    return resp;
  }

  return (
    <div className="line" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={() => handleClaimLine(outerKey, innerKey, other.taken)}>
      {squares()}
    </div>
  )
}
//==================================================================================================

//==================================================================================================


export default function Rail({ data, myKey, handleClaimLine, color }) {

  const lines = data.map((line, i) => {
    let other = i === 0 ? data[1] : data[0];
    return <Line data={line} key={i} outerKey={myKey} innerKey={i} handleClaimLine={handleClaimLine} color={color} other={data.length > 1 ? other : false} />
  })

  return (
    <div key={myKey} className={`rail rail-${myKey}`}>
      {lines}
    </div>
  )
}
