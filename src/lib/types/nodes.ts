export interface FlowDiagram {
  title: string;
  nodes: FDNode[];
  flows: Flow[];
  edges: Edge[];
};

export type Flow = {
  id: string;
  label: string;
  style: { color?: string, strokeStyle?: string};
}

export type Edge = {
  flow: string;
  from: string;
  to: string;
  // Add additional attributes as needed
};

export type FDNode = {
  id: string; // Should be a unique string
  title?: string; // The name shown in the PFD
  icon?: string; // The icon shown in the PFD
  subdiagram?: FlowDiagram;
  render?: (node: FDNode) => {html: JSX.Element, width: number, height: number};
};
