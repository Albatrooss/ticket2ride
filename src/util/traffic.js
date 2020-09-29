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

function checkConnected(user, num) {
  let used = [];
  let answer = false;
  let myNodes = user.routes;
  let s = user.dCards[num].start;
  let e = user.dCards[num].end;
  if (!myNodes.includes(s) || !myNodes.includes(e)) return false

  test(s);

  function test(newStart) {
    if (newStart === e) {
      answer = true;
    }
    used.push(newStart);
    let start = lines.find(l => l.node === newStart);
    start.connections.filter(n => myNodes.includes(n) && !used.includes(n)).forEach(n => {
      test(n, e);
    })
  }

  return answer;
}

module.exports = {
  checkConnected
}