import React, { useState } from 'react'

import Rail from './Rail';
import '../styles/tokens.css';

import { defaultTokens, defaultPaths } from '../game/gameDefault';

export default function Board({ logic, handleClaimLine }) {

  const [paths, setPaths] = useState(defaultPaths);
  const [tokens, setTokens] = useState(defaultTokens)

  const mappedPaths = paths.map((path, i) => <Rail data={path} key={i} handleClaimLine={handleClaimLine} myKey={i} />)

  const mappedTokens = tokens.map((token, i) => <div className={`token token-${i}`}>{token.points ? 1 : ''}<p className={`p-${i}`}>{token.name}</p></div>)

  return (
    <div className='board'>
      {mappedPaths}
      {mappedTokens}
    </div>
  )
}
