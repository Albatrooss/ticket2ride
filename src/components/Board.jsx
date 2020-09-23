import React from 'react'

import Rail from './Rail';
import '../styles/tokens.css';
<<<<<<< HEAD
=======
import '../styles/lines.css';
>>>>>>> 3b710aa6baaa21a23a121676fbd4a32625a6572e

export default function Board({ gameState }) {


  const mappedPaths = gameState.paths.map((path, i) => <Rail data={path} key={i} myKey={i} />)

  const mappedTokens = gameState.tokens.map((token, i) => <div className={`token token-${i}`}>{token ? 1 : ''}</div>)

  return (
    <div className='board'>
      {mappedPaths}
      {mappedTokens}
<<<<<<< HEAD
=======
      <img src="images/Map-01.png" alt="" />
>>>>>>> 3b710aa6baaa21a23a121676fbd4a32625a6572e
    </div>
  )
}
