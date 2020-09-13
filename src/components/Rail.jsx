import React from 'react'

function Line({ data }) {

  const squares = () => {
    let resp = [];
    for (let i = 0; i < data.num; i++) {
      resp.push(<div key={i} className={`square ${data.color} ${data.special ? data.special : ''}`}>{data.taken ? <div className={`taxi ${data.taken}`}></div> : ''}</div>)
    }
    return resp;
  }

  return (
    <div className="line">
      {squares()}
    </div>
  )
}

export default function Rail({ data, myKey }) {

  const lines = data.map((line, i) => <Line data={line} key={i} />)

  return (
    <div key={myKey} className={`line-container line-${myKey}`}>
      {lines}
    </div>
  )
}
