const lines = [
  {
    node: 'Lincoln Center',
    connections: ['Midtown West', 'Times Square', 'Central Park']
  },
  {
    node: 'Midtown West',
    connections: ['Lincoln Center', 'Times Square', 'Empire State Building', 'Chelsea']
  },
  {
    node: 'Times Square',
    connections: ['Midtown West', 'Lincoln Center', 'Central Park', 'United Nations', 'Empire State Building']
  },
  {
    node: 'Central Park',
    connections: ['Lincoln Center', 'Times Square', 'United Nations']
  },
  {
    node: 'United Nations',
    connections: ['Central Park', 'Times Square', 'Empire State Building', 'Gramercy Park']
  },
  {
    node: 'Empire State Building',
    connections: ['Midtown West', 'Times Square', 'United Nations', 'Gramercy Park', 'Chelsea']
  },
  {
    node: 'Chelsea',
    connections: ['Midtown West', 'Empire State Building', 'Gramercy Park', 'Greenwich Village', 'Soho']
  },
  {
    node: 'Gramercy Park',
    connections: ['ESP', 'Chelsea', 'United Nations', 'East Village', 'Greenwich Village']
  },
  {
    node: 'Greenwich Village',
    connections: ['Chelsea', 'Gramercy Park', 'East Village', 'Lower East Side', 'Chinatown', 'Soho']
  },
  {
    node: 'East Village',
    connections: ['Gramercy Park', 'Greenwich Village', 'Lower East Side']
  },
  {
    node: 'Lower East Side',
    connections: ['East Village', 'Greenwich Village', 'Chinatown', 'Brooklyn']
  },
  {
    node: 'Soho',
    connections: ['Chelsea', 'Greenwich Village', 'Wall Street']
  },
  {
    node: 'Chinatown',
    connections: ['Greenwich Village', 'Lower East Side', 'Brooklyn', 'Wall Street']
  },
  {
    node: 'Wall Street',
    connections: ['Soho', 'Chinatown', 'Brooklyn']
  },
  {
    node: 'Brooklyn',
    connections: ['Wall Street', 'Chinatown', 'Lower East Side']
  }
]

const paths = [
  //0
  [{
    color: 'orange',
    num: 2,
    taken: false,
    nodes: ['Lincoln Center', 'Central Park']
  }],
  //1
  [{
    color: 'red',
    num: 2,
    taken: false,
    nodes: ['Lincoln Center', 'Midtown West']
  }],
  //2
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
  //3
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
  //4
  [{
    color: 'pink',
    num: 3,
    taken: false,
    nodes: ['United Nations', 'Central Park']
  }],
  //5
  [{
    color: 'grey',
    num: 1,
    taken: false,
    nodes: ['Midtown West', 'Times Square']
  }],
  //6
  [{
    color: 'grey',
    num: 2,
    taken: false,
    nodes: ['Times Square', 'United Nations']
  }],
  //7
  [{
    color: 'blue',
    num: 2,
    taken: false,
    nodes: ['Midtown West', 'Chelsea']
  }],
  //8
  [{
    color: 'green',
    num: 2,
    taken: false,
    nodes: ['Midtown West', 'Empire State Building']
  }],
  //9
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
  //10
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
  //11
  [{
    color: 'black',
    num: 2,
    taken: false,
    nodes: ['United Nations', 'Empire State Building']
  }],
  //12
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
  //13
  [{
    color: 'green',
    num: 3,
    taken: false,
    nodes: ['United Nations', 'Gramercy Park']
  }],
  //14
  [{
    color: 'pink',
    num: 4,
    taken: false,
    nodes: ['Chelsea', 'Soho']
  }],
  //15
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
  //16
  [{
    color: 'orange',
    num: 2,
    taken: false,
    nodes: ['Chelsea', 'Gramercy Park']
  }],
  //17
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
  //18
  [{
    color: 'grey',
    num: 2,
    taken: false,
    nodes: ['Gramercy Park', 'East Village']
  }],
  //19
  [{
    color: 'blue',
    num: 2,
    taken: false,
    nodes: ['Greenwich Village', 'East Village']
  }],
  //20
  [{
    color: 'orange',
    num: 2,
    taken: false,
    nodes: ['Soho', 'Greenwich Village']
  }],

  //21
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
  //22
  [{
    color: 'grey',
    num: 2,
    taken: false,
    nodes: ['Lower East Side', 'Greenwich Village']
  }],
  //23
  [{
    color: 'black',
    num: 1,
    taken: false,
    nodes: ['East Village', 'Lower East Side']
  }],
  //24
  [{
    color: 'blue',
    num: 1,
    taken: false,
    nodes: ['Lower East Side', 'Chinatown']
  }],
  //25
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
  //26
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
  //27
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
  //28
  [{
    color: 'grey',
    num: 3,
    taken: false,
    nodes: ['Brooklyn', 'Soho']
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

let pathsLogic = {};

paths.forEach((p, a) => {
  p.forEach((x, b) => {
    pathsLogic[`${a}-${b}`] = false
  })
})

const startingDeck = [
  'red',
  'red',
  'red',
  'red',
  'red',
  'red',
  'blue',
  'blue',
  'blue',
  'blue',
  'blue',
  'blue',
  'orange',
  'orange',
  'orange',
  'orange',
  'orange',
  'orange',
  'green',
  'green',
  'green',
  'green',
  'green',
  'green',
  'black',
  'black',
  'black',
  'black',
  'black',
  'black',
  'pink',
  'pink',
  'pink',
  'pink',
  'pink',
  'pink',
  'wild',
  'wild',
  'wild',
  'wild',
  'wild',
  'wild',
  'wild',
  'wild',
]

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
  lines,
  defaultPaths: paths,
  pathsLogic,
  defaultTokens: tokens,
  startingDeck,
  defaultDestinations,
  cards
}