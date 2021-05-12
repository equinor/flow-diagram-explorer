export interface FlowDiagram {
  title: string;
  nodes: FDNode[];
  edges: Edge[];
};

export type Edge = {
  from: string;
  to: string;
  // Add additional attributes as needed
};

export type FDNode = {
  id: string; // Should be a unique string
  title?: string; // The name shown in the PFD
  icon?: string; // The icon shown in the PFD
  subdiagram?: FlowDiagram;
};
