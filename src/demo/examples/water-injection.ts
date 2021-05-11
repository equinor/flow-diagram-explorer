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
    {
      id: 'pump5',
      title: 'Pump 5',
      icon: 'pump',
    },
    {
      id: 'other',
      title: 'Other',
      icon: 'other',
    },
  ],
  edges: [
    { from: 'input', to: 'pump1' },
    { from: 'input', to: 'pump2' },
    { from: 'input', to: 'pump3' },
    { from: 'input', to: 'pump4' },
    { from: 'pump2', to: 'pump5' },
    { from: 'pump5', to: 'other' },
    { from: 'pump2', to: 'other' },
    { from: 'pump3', to: 'other' },
    { from: 'pump4', to: 'other' },
  ]
};
