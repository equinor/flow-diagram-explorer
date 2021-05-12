import { FlowDiagram } from '../../lib/types/nodes';

export const waterinj: FlowDiagram = {
  title: 'waterinjection',
  nodes: [
    {
      id: 'input',
    },
    {
      id: '1',
      title: '1',
      icon: 'pump',
    },
    {
      id: '2',
      title: '2',
      icon: 'pump',
    },
    {
      id: '3',
      title: '3',
      icon: 'pump',
    },
    {
      id: '4',
      title: '4',
      icon: 'pump',
    },
    {
      id: '5',
      title: '5',
      icon: 'pump',
    },
    {
      id: '6',
      title: '6',
      icon: 'other',
    },
    {
      id: '7',
      title: '7',
      icon: 'other',
    },
    {
      id: '8',
      title: '8',
      icon: 'other',
    },
    {
      id: '9',
      title: '9',
      icon: 'other',
    },
    {
      id: '10',
      title: '10',
      icon: 'other',
    },
  ],
  edges: [
    { from: "input", to: "1"},
    { from: "input", to: "2"},
    { from: "input", to: "3"},
    { from: "input", to: "4"},
    { from: "1", to: "5"},
    { from: "2", to: "6"},
    { from: "3", to: "7"},
    { from: "4", to: "8"},
    { from: "5", to: "9"},
    { from: "6", to: "10"},
    { from: "7", to: "10"},
    { from: "10", to: "9"},
  ]
};
