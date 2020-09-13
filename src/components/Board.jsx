import React from 'react'

import Rail from './Rail';
import '../styles/tokens.css';
import '../styles/lines.css';

export default function Board({ gameState }) {


  const mappedPaths = gameState.paths.map((path, i) => <Rail data={path} key={i} myKey={i} />)

  const mappedTokens = gameState.tokens.map((token, i) => <div className={`token token-${i}`}>{token ? 1 : ''}</div>)

  return (
    <div className='board'>
      {mappedPaths}
      {mappedTokens}
      <img src="images/Map-01.png" alt="" />
    </div>
  )
}
