import React, { useState } from 'react'

import Rail from './Rail';
import '../styles/tokens.css';

import { defaultTokens, defaultPaths } from '../game/gameDefault';

export default function Board({ logic, handleClaimLine, color, destinations }) {

  const [paths, setPaths] = useState(defaultPaths);
  const [tokens, setTokens] = useState(defaultTokens)

  let newPaths = [...paths];
  for (let p in logic.paths) {
    let keys = p.split('-');
    let outerKey = keys[0];
    let innerKey = keys[1];
    newPaths[outerKey][innerKey].taken = logic.paths[p];
  }

  const mappedPaths = paths.map((path, i) => <Rail data={path} key={i} handleClaimLine={handleClaimLine} myKey={i} color={color} />)

  const mappedTokens = tokens.map((token, i) => <div className={`token token-${i} ${destinations.includes(token.name) ? 'glowing' : ''}`}>{token.points ? 1 : ''}<p className={`p-${i}`}>{token.name}</p></div>)

  return (
    <div className='board'>
      {mappedPaths}
      {mappedTokens}
    </div>
  )
}
