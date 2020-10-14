import React from 'react'

import Rail from './Rail';
import '../styles/tokens.css';

import { defaultTokens, defaultPaths } from '../game/gameDefault';

export default function Board({ logic, handleClaimLine, color, destinations, myTokens = [] }) {

  let newPaths = [...defaultPaths];
  for (let p in logic.paths) {
    let keys = p.split('-');
    let outerKey = keys[0];
    let innerKey = keys[1];
    newPaths[outerKey][innerKey].taken = logic.paths[p];
  }

  const mappedPaths = newPaths.map((path, i) => <Rail data={path} key={i} handleClaimLine={handleClaimLine} myKey={i} color={color} />)

  const mappedTokens = defaultTokens.map((token, i) => (
    <div key={token.name} className={`token token-${i} ${destinations.includes(token.name) ? 'glowing' : ''} ${myTokens.includes(token.name) ? 'taken' : ''}`}>
      {token.points ? 1 : ''}
      <p className={`p-${i}`}>
        {token.name}
      </p>
      {destinations.includes(token.name) && <div className="ring" style={{ border: `2px solid ${color}` }} />}
    </div>));

  return (
    <div className='board'>
      {mappedPaths}
      {mappedTokens}
    </div>
  )
}
