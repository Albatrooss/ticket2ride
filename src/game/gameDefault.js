const paths = [
  [{
    color: 'orange',
    num: 2,
    taken: false
  }],
  [{
    color: 'red',
    num: 2,
    taken: false
  }],
  [{
    color: 'green',
    num: 2,
    taken: false
  },
  {
    color: 'blue',
    num: 2,
    taken: false
  }],
  [{
    color: 'black',
    num: 2,
    taken: false
  },
  {
    color: 'red',
    num: 2,
    taken: false
  }],
  [{
    color: 'pink',
    num: 3,
    taken: false,
    special: 'top-corner'
  }],
  [{
    color: 'grey',
    num: 1,
    taken: false
  }],
  [{
    color: 'grey',
    num: 2,
    taken: false
  }],
  [{
    color: 'blue',
    num: 2,
    taken: false
  }],
  [{
    color: 'green',
    num: 2,
    taken: false
  }],
  [{
    color: 'orange',
    num: 1,
    taken: false
  },
  {
    color: 'pink',
    num: 1,
    taken: false
  }],
  [{
    color: 'grey',
    num: 2,
    taken: false
  },
  {
    color: 'grey',
    num: 2,
    taken: false
  }],
  [{
    color: 'black',
    num: 2,
    taken: false
  }],
  [{
    color: 'red',
    num: 1,
    taken: false
  },
  {
    color: 'blue',
    num: 1,
    taken: false
  }],
  [{
    color: 'green',
    num: 3,
    taken: false,
    special: 'mid-right'
  }],
  [{
    color: 'pink',
    num: 4,
    taken: false
  }],
  [{
    color: 'green',
    num: 3,
    taken: false
  },
  {
    color: 'red',
    num: 3,
    taken: false
  }],
  [{
    color: 'orange',
    num: 2,
    taken: false
  }],
  [{
    color: 'black',
    num: 2,
    taken: false
  },
  {
    color: 'pink',
    num: 2,
    taken: false
  }],
  [{
    color: 'grey',
    num: 2,
    taken: false
  }],
  [{
    color: 'blue',
    num: 2,
    taken: false
  }],
  [{
    color: 'orange',
    num: 2,
    taken: false,
    special: 'bottom-left'
  }],
  [{
    color: 'grey',
    num: 2,
    taken: false
  },
  {
    color: 'grey',
    num: 2,
    taken: false
  }],
  [{
    color: 'grey',
    num: 2,
    taken: false
  }],
  [{
    color: 'black',
    num: 1,
    taken: false
  }],
  [{
    color: 'blue',
    num: 1,
    taken: false
  }],
  [{
    color: 'green',
    num: 1,
    taken: false
  },
  {
    color: 'pink',
    num: 1,
    taken: false
  }],
  [{
    color: 'black',
    num: 3,
    taken: false
  },
  {
    color: 'blue',
    num: 3,
    taken: false
  }],
  [{
    color: 'red',
    num: 3,
    taken: false
  },
  {
    color: 'orange',
    num: 3,
    taken: false
  }],
  [{
    color: 'grey',
    num: 3,
    taken: false,
    special: 'bottom-right'
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

module.exports = {
  paths,
  tokens
}