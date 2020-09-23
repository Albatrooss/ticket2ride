<<<<<<< HEAD
import React, { useState } from 'react';
import '../styles/rails.css';

function Line({ data }) {

  const [hovered, setHovered] = useState(false);

  const squares = () => {
    let resp = [];
    for (let i = 0; i < data.num; i++) {
      resp.push(<div key={i} className={`square ${data.color} ${hovered ? 'hovered' : ''}`}>{data.taken ? <div className={`taxi ${data.taken}`}></div> : ''}</div>)
=======
import React from 'react'

function Line({ data }) {

  const squares = () => {
    let resp = [];
    for (let i = 0; i < data.num; i++) {
      resp.push(<div key={i} className={`square ${data.color} ${data.special ? data.special : ''}`}>{data.taken ? <div className={`taxi ${data.taken}`}></div> : ''}</div>)
>>>>>>> 3b710aa6baaa21a23a121676fbd4a32625a6572e
    }
    return resp;
  }

  return (
<<<<<<< HEAD
    <div className="line" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
=======
    <div className="line">
>>>>>>> 3b710aa6baaa21a23a121676fbd4a32625a6572e
      {squares()}
    </div>
  )
}

export default function Rail({ data, myKey }) {

  const lines = data.map((line, i) => <Line data={line} key={i} />)

  return (
<<<<<<< HEAD
    <div key={myKey} className={`rail rail-${myKey}`}>
=======
    <div key={myKey} className={`line-container line-${myKey}`}>
>>>>>>> 3b710aa6baaa21a23a121676fbd4a32625a6572e
      {lines}
    </div>
  )
}
