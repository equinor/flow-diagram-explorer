import { FlowDiagram, Edge } from '../types/nodes';
import { NodePath } from '../types/nodepath';

export const FlowDiagramParser = (flowDiagram: FlowDiagram): NodePath[] => {
    let nodePaths: NodePath[] = [];
    let startNodes: string[] = [];
    let endNodes: string[] = [];

    if (!flowDiagram.edges) {
        return nodePaths; // edges should maybe always be defined?
    }

    startNodes = flowDiagram.edges.reduce((filtered: string[], node1: Edge) => {
        if (!flowDiagram.edges!.some(node2 => node2.to === node1.from) && !filtered.includes(node1.from)) {
            filtered.push(node1.from);
        }
        return filtered;
    }, []);

    endNodes = flowDiagram.edges.reduce((filtered: string[], node1: Edge) => {
        if (!flowDiagram.edges!.some(node2 => node2.from === node1.to)) {
            filtered.push(node1.to);
        }
        return filtered;
    }, []);

    startNodes.forEach(node => {
        nodePaths = nodePaths.concat(recursivelyFollowNodePath(node, flowDiagram.edges!, { startNode: node, nodes: [node], fullPath: true }));
    });

    nodePaths = nodePaths.filter(node => !endNodes.includes(node.startNode));

    return nodePaths;
};

const recursivelyFollowNodePath = (currentNode: string, edges: Edge[], nodePath: NodePath,): NodePath[] => {
    let newEdges = [...edges];
    let newNodePaths: NodePath[] = [];

    const nextNodes = edges.reduce((filtered: string[], node: Edge) => {
        if (node.from === currentNode) {
            filtered.push(node.to);
            newEdges = newEdges.filter(el => el.from !== currentNode && el.to !== node.to);
        }
        return filtered;
    }, []);

    if (nextNodes.length === 0) {
        return [nodePath];
    }

    for (const node of nextNodes) {
        newNodePaths = newNodePaths.concat(recursivelyFollowNodePath(node, newEdges, { startNode: nodePath.nodes[0], nodes: [...nodePath.nodes, node], fullPath: nodePath.fullPath }));
        newNodePaths = newNodePaths.concat(recursivelyFollowNodePath(node, newEdges, { startNode: node, nodes: [node], fullPath: false }));
    }

    return newNodePaths;
};
