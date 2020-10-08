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

function checkConnected(startingNode, endingNode, routes = []) {
  let usedPaths = []
  let answer = false;

  let myRoutes = [...routes]
  routes.forEach(r => myRoutes.push(r.split('-')[1] + '-' + r.split('-')[0]))

  if (!myRoutes.some(r => r.split('-').includes(startingNode)) || !myRoutes.some(r => r.split('-').includes(endingNode))) return false;

  test(startingNode)

  function test(newStart) {

    if (answer) return;

    let line = lines.find(l => l.node === newStart);
    let paths = line.connections.map(c => `${newStart}-${c}`).filter(p => myRoutes.includes(p) && !usedPaths.includes(p));
    if (paths.length < 1) return

    // push the first path [start]-[end] and [end]-[start] onto used list, so it wont be checked again
    usedPaths.push(paths[0]);
    console.log(usedPaths[usedPaths.length - 1]);
    usedPaths.push(paths[0].split('-')[1] + '-' + paths[0].split('-')[0]);

    //recursively check the next node on the list
    if (paths.some(p => p.split('-')[1] === endingNode)) return answer = true;
    paths.forEach(p => test(p.split('-')[1]));
  }

  return answer;
}

console.log(checkConnected('Central Park', 'Gramercy Park', ['United Nations-Central Park', 'United Nations-Gramercy Park']))


module.exports = {
  lines
}