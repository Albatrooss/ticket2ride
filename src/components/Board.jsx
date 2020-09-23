import React from 'react'

import Rail from './Rail';
import '../styles/tokens.css';

export default function Board({ gameState }) {

  const mappedPaths = gameState.paths.map((path, i) => <Rail data={path} key={i} myKey={i} />)

  const mappedTokens = gameState.tokens.map((token, i) => <div className={`token token-${i}`}>{token.points ? 1 : ''}<p className={`p-${i}`}>{token.name}</p></div>)

  return (
    <div className='board'>
      {mappedPaths}
      {mappedTokens}
    </div>
  )
}
