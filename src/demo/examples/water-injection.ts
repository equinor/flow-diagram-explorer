import { FlowDiagram } from '../../lib/types/nodes';

export const waterinj: FlowDiagram = {
  title: 'waterinjection',
  nodes: [
    {
      id: 'input',
    },
    {
      id: 'pump1',
      title: 'Pump 1',
      icon: 'pump',
    },
    {
      id: 'pump2',
      title: 'Pump 2',
      icon: 'pump',
    },
    {
      id: 'pump3',
      title: 'Pump 3',
      icon: 'pump',
    },
    {
      id: 'pump4',
      title: 'Pump 4',
      icon: 'pump',
    },
  ],
  edges: [
    {from: 'input', to: 'pump1'},
    {from: 'input', to: 'pump2'},
    {from: 'input', to: 'pump3'},
    {from: 'input', to: 'pump4'},
  ]
};
