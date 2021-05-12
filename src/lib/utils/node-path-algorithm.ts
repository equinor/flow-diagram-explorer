import { FlowDiagram, Edge } from '../types/nodes';
import { NodePath } from '../types/nodepath';
import { DiagramNode } from '../types/diagram';

export const LinearPositioner = (flowDiagram: FlowDiagram): {[key: string]: number} => {
    const nodePaths = FlowDiagramParser(flowDiagram);
    
    const nodeCoordinates: {[key: string]: number} = {};

    flowDiagram.nodes.forEach(({id}) => {
        const longestPath = nodePaths.reduce((value: number, path: NodePath) => {
            if (path.endNode && path.endNode === id) {
                value = Math.max(value, path.nodes.length - 1);
            }
            return value;
        }, 0);
        nodeCoordinates[id] = longestPath;
    });

    return nodeCoordinates;
};

export const LinearOptimizer = (flowDiagram: FlowDiagram): DiagramNode[] => {
    const nodeCoordinates = LinearPositioner(flowDiagram);
    const nodePaths = FlowDiagramParser(flowDiagram);

    const startNodes = flowDiagram.edges.reduce((filtered: string[], node1: Edge) => {
        if (!flowDiagram.edges!.some(node2 => node2.to === node1.from) && !filtered.includes(node1.from)) {
            filtered.push(node1.from);
        }
        return filtered;
    }, []);

    const coordinates: {[key: string]: number} = {};

    startNodes.forEach(currentNode => {
        const childNodes = nodePaths.filter(path => path.startNode === currentNode && path.fullPath).length;
        adjustCoordinates(currentNode, childNodes / 2, nodePaths, coordinates, {});
    });

    const result: DiagramNode[]  = [];
    flowDiagram.nodes.forEach(node => {
        result.push({
            node: node.id,
            centerPosition: { x: nodeCoordinates[node.id], y: coordinates[node.id]},
            dimensions: { width: 1, height: 1}
        });
    });

    return result;
}

const adjustCoordinates = (currentNode: string, y: number, nodePaths: NodePath[], coordinates: {[key: string]: number}, usedParentNodes: {[key: string]: string[]}) => {
    if (!Object.keys(usedParentNodes).includes(currentNode)) {
        usedParentNodes[currentNode] = [];
    }
    const parentNodes = nodePaths.filter(path => path.endNode === currentNode && path.nodes.length === 2).map(path => path.nodes[0]).reduce((filtered: string[], value: string) => {
        if (!filtered.includes(value)) {
            filtered.push(value);
        }
        return filtered;
    }, []);
    if (parentNodes.length > 0) {
        coordinates[currentNode] = coordinates[currentNode] ? coordinates[currentNode] + y / parentNodes.length : y / parentNodes.length;
    }
    else {
        coordinates[currentNode] = y
    }
    const childNodes = nodePaths.filter(path => path.startNode === currentNode && path.nodes.length > 1).map(path => path.nodes[1]).filter((item, pos, arr) => !pos || item != arr[pos-1]);
    const angleShare = Math.PI / (childNodes.length + 1);
    childNodes.forEach((node, index) => {
        if (!usedParentNodes[currentNode].includes(node)) {
            usedParentNodes[currentNode].push(node);
            const newY = y + Math.sin(Math.PI / 2 - (index + 1) * angleShare);
            adjustCoordinates(node, newY, nodePaths, coordinates, usedParentNodes);
        }
    });
}

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
            newEdges = newEdges.filter(el => !(el.from === currentNode && el.to === node.to));
        }
        return filtered;
    }, []);

    if (nextNodes.length === 0) {
        return [nodePath];
    }

    for (const node of nextNodes) {
        newNodePaths = newNodePaths.concat(recursivelyFollowNodePath(node, newEdges, { startNode: nodePath.nodes[0], nodes: [...nodePath.nodes, node], fullPath: nodePath.fullPath }));
        newNodePaths = newNodePaths.concat(recursivelyFollowNodePath(node, newEdges, { startNode: node, nodes: [node], fullPath: false }));
        newNodePaths = newNodePaths.concat({ startNode: nodePath.nodes[0], endNode: node, nodes: [...nodePath.nodes, node], fullPath: false })
    }

    return newNodePaths;
};
