const lines = [
  {
    node: 'LC',
    connections: ['MW', 'TS', 'CP']
  },
  {
    node: 'MW',
    connections: ['LS', 'TS', 'ESB', 'C']
  },
  {
    node: 'TS',
    connections: ['MW', 'LC', 'CP', 'UN', 'ESB']
  },
  {
    node: 'CP',
    connections: ['LC', 'TS', 'UN']
  },
  {
    node: 'UN',
    connections: ['CP', 'TS', 'ESB', 'GP']
  },
  {
    node: 'ESB',
    connections: ['MW', 'TS', 'UN', 'GP', 'C']
  },
  {
    node: 'C',
    connections: ['MW', 'ESB', 'GP', 'GV', 'S']
  },
  {
    node: 'GP',
    connections: ['ESP', 'C', 'UN', "EV", 'GV']
  },
  {
    node: 'GV',
    connections: ['C', 'GP', 'EV', 'LES', 'CT', 'S']
  },
  {
    node: 'EV',
    connections: ['GP', 'GV', 'LES']
  },
  {
    node: 'LES',
    connections: ['EV', 'GV', 'CT', 'B']
  },
  {
    node: 'S',
    connections: ['C', 'GV', 'WS']
  },
  {
    node: 'CT',
    connections: ['GV', 'LES', 'B', 'WS']
  },
  {
    node: 'WS',
    connections: ['S', 'CT', 'B']
  },
  {
    node: 'B',
    connections: ['WS', 'CT', 'LES']
  }
]

function checkConnected(myNodes, s, e) {
  let used = [];
  let answer = false;
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