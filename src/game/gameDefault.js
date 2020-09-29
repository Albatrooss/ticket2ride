const paths = [
  [{
    color: 'orange',
    num: 2,
    taken: false,
    nodes: ['Lincoln Center', 'Central Park']
  }],
  [{
    color: 'red',
    num: 2,
    taken: false,
    nodes: ['Lincoln Center', 'Midtown West']
  }],
  [{
    color: 'green',
    num: 2,
    taken: false,
    nodes: ['Lincoln Center', 'Times Square']
  },
  {
    color: 'blue',
    num: 2,
    taken: false,
    nodes: ['Lincoln Center', 'Times Square']
  }],
  [{
    color: 'black',
    num: 2,
    taken: false,
    nodes: ['Times Square', 'Central Park']
  },
  {
    color: 'red',
    num: 2,
    taken: false,
    nodes: ['Times Square', 'Central Park']
  }],
  [{
    color: 'pink',
    num: 3,
    taken: false,
    nodes: ['United Nations', 'Central Park']
  }],
  [{
    color: 'grey',
    num: 1,
    taken: false,
    nodes: ['Midtown West', 'Times Square']
  }],
  [{
    color: 'grey',
    num: 2,
    taken: false,
    nodes: ['Times Square', 'United Nations']
  }],
  [{
    color: 'blue',
    num: 2,
    taken: false,
    nodes: ['Midtown West', 'Chelsea']
  }],
  [{
    color: 'green',
    num: 2,
    taken: false,
    nodes: ['Midtown West', 'Empire State Building']
  }],
  [{
    color: 'orange',
    num: 1,
    taken: false,
    nodes: ['Times Square', 'Empire State Building']
  },
  {
    color: 'pink',
    num: 1,
    taken: false,
    nodes: ['Times Square', 'Empire State Building']
  }],
  [{
    color: 'grey',
    num: 2,
    taken: false,
    nodes: ['Chelsea', 'Empire State Building']
  },
  {
    color: 'grey',
    num: 2,
    taken: false,
    nodes: ['Chelsea', 'Empire State Building']
  }],
  [{
    color: 'black',
    num: 2,
    taken: false,
    nodes: ['United Nations', 'Empire State Building']
  }],
  [{
    color: 'red',
    num: 1,
    taken: false,
    nodes: ['Gramercy Park', 'Empire State Building']
  },
  {
    color: 'blue',
    num: 1,
    taken: false,
    nodes: ['Gramercy Park', 'Empire State Building']
  }],
  [{
    color: 'green',
    num: 3,
    taken: false,
    nodes: ['United Nations', 'Gramercy Park']
  }],
  [{
    color: 'pink',
    num: 4,
    taken: false,
    nodes: ['Chelsea', 'Soho']
  }],
  [{
    color: 'green',
    num: 3,
    taken: false,
    nodes: ['Chelsea', 'Greenwich Village']
  },
  {
    color: 'red',
    num: 3,
    taken: false,
    nodes: ['Chelsea', 'Greenwich Village']
  }],
  [{
    color: 'orange',
    num: 2,
    taken: false,
    nodes: ['Chelsea', 'Gramercy Park']
  }],
  [{
    color: 'black',
    num: 2,
    taken: false,
    nodes: ['Gramercy Park', 'Greenwich Village']
  },
  {
    color: 'pink',
    num: 2,
    taken: false,
    nodes: ['Gramercy Park', 'Greenwich Village']
  }],
  [{
    color: 'grey',
    num: 2,
    taken: false,
    nodes: ['Gramercy Park', 'East Village']
  }],
  [{
    color: 'blue',
    num: 2,
    taken: false,
    nodes: ['Greenwich Village', 'East Village']
  }],
  [{
    color: 'orange',
    num: 2,
    taken: false,
    nodes: ['Soho', 'Greenwich Village']
  }],
  [{
    color: 'grey',
    num: 2,
    taken: false,
    nodes: ['Chinatown', 'Greenwich Village']
  },
  {
    color: 'grey',
    num: 2,
    taken: false,
    nodes: ['Chinatown', 'Greenwich Village']
  }],
  [{
    color: 'grey',
    num: 2,
    taken: false,
    nodes: ['Lower East Side', 'Greenwich Village']
  }],
  [{
    color: 'black',
    num: 1,
    taken: false,
    nodes: ['East Village', 'Lower East Side']
  }],
  [{
    color: 'blue',
    num: 1,
    taken: false,
    nodes: ['Lower East Side', 'Chinatown']
  }],
  [{
    color: 'green',
    num: 1,
    taken: false,
    nodes: ['Chinatown', 'Wall Street']
  },
  {
    color: 'pink',
    num: 1,
    taken: false,
    nodes: ['Chinatown', 'Wall Street']
  }],
  [{
    color: 'black',
    num: 3,
    taken: false,
    nodes: ['Brooklyn', 'Wall Street']
  },
  {
    color: 'blue',
    num: 3,
    taken: false,
    nodes: ['Brooklyn', 'Wall Street']
  }],
  [{
    color: 'red',
    num: 3,
    taken: false,
    nodes: ['Brooklyn', 'Chinatown']
  },
  {
    color: 'orange',
    num: 3,
    taken: false,
    nodes: ['Brooklyn', 'Chinatown']
  }],
  [{
    color: 'grey',
    num: 3,
    taken: false,
    nodes: ['Brooklyn', 'Lower East Side']
  }]
]

const tokens = [
  {
    points: false,
    name: 'Lincoln Center'
  },
  {
    points: true,
    name: 'Central Park'
  },
  {
    points: false,
    name: 'Midtown West'
  },
  {
    points: true,
    name: 'Times Square'
  },
  {
    points: true,
    name: 'United Nations'
  },
  {
    points: true,
    name: 'Chelsea'
  },
  {
    points: true,
    name: 'Empire State Building'
  },
  {
    points: false,
    name: 'Gramercy Park'
  },
  {
    points: true,
    name: 'Greenwich Village'
  },
  {
    points: false,
    name: 'East Village'
  },
  {
    points: false,
    name: 'Soho'
  },
  {
    points: true,
    name: 'Chinatown'
  },
  {
    points: true,
    name: 'Lower East Side'
  },
  {
    points: true,
    name: 'Wall Street'
  },
  {
    points: true,
    name: 'Brooklyn'
  }
]

const cards = [
  {
    color: 'red',
    symbol: 'Red'
  },
  {
    color: 'blue',
    symbol: 'Blue'
  },
  {
    color: 'green',
    symbol: 'Green'
  },
  {
    color: 'pink',
    symbol: 'Pink'
  },
  {
    color: 'orange',
    symbol: 'Orange'
  },
  {
    color: 'black',
    symbol: 'Black'
  }
]

let pathsLogic = [];
for (let i = 0; i < 30; i++) {
  pathsLogic.push(false);
}

const startingDeck = {
  red: 6,
  blue: 6,
  orange: 6,
  green: 6,
  black: 6,
  pink: 6,
  wild: 8
}

const defaultDestinations = [
  {
    start: 'United Nations',
    end: 'Wall Street',
    taken: false,
    points: 8
  },
  {
    start: 'Lincoln Center',
    end: 'Greenwich Village',
    taken: false,
    points: 6
  },
  {
    start: 'Times Square',
    end: 'East Village',
    taken: false,
    points: 4
  },
  {
    start: 'Lower East Side',
    end: 'Wall Street',
    taken: false,
    points: 2
  },
  {
    start: 'East Village',
    end: 'Soho',
    taken: false,
    points: 4
  },
  {
    start: 'Empire State Building',
    end: 'Greenwich Village',
    taken: false,
    points: 3
  },
  {
    start: 'Chelsea',
    end: 'Brooklyn',
    taken: false,
    points: 8
  },
  {
    start: 'Central Park',
    end: 'Midtown West',
    taken: false,
    points: 3
  },
  {
    start: 'Central Park',
    end: 'Gramercy Park',
    taken: false,
    points: 4
  },
  {
    start: 'Lincoln Center',
    end: 'Empire State Building',
    taken: false,
    points: 3
  },
  {
    start: 'Times Square',
    end: 'Soho',
    taken: false,
    points: 6
  },
  {
    start: 'Empire State Building',
    end: 'Brooklyn',
    taken: false,
    points: 7
  },
  {
    start: 'Central Park',
    end: 'Chelsea',
    taken: false,
    points: 5
  },
  {
    start: 'Chelsea',
    end: 'Wall Street',
    taken: false,
    points: 6
  },
  {
    start: 'Central Park',
    end: 'Chinatown',
    taken: false,
    points: 8
  },
  {
    start: 'Times Square',
    end: 'Brooklyn',
    taken: false,
    points: 8
  },
  {
    start: 'United Nations',
    end: 'Midtown West',
    taken: false,
    points: 3
  },
  {
    start: 'Gramercy Park',
    end: 'Chinatown',
    taken: false,
    points: 4
  },
]

module.exports = {
  defaultPaths: paths,
  pathsLogic,
  defaultTokens: tokens,
  startingDeck,
  defaultDestinations,
  cards
}