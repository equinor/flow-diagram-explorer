import { FlowDiagram } from '../types/nodes';
import { DiagramConfig, DiagramNode, DiagramArrow } from "../types/diagram";
import { NodePath } from "../types/nodepath";

type DiagramDrawerProps = {
    diagram: FlowDiagram;
    nodePaths: NodePath[];
    config?: DiagramConfig;
};

type NodesAndArrowsProps = {
    diagram: FlowDiagram;
    nodePaths: NodePath[];
    config: DiagramConfig;
    currentNodePath: NodePath;
    currentIndex: number;
    startX: number;
    startY: number;
};

type Diagram = {
    nodes: DiagramNode[];
    arrows: DiagramArrow[];
};

const defaultConfig: DiagramConfig = {
    horizontalSpacing: 10,
    verticalSpacing: 10,
    nodeDimensions: { width: 100, height: 60 },
}

export const DiagramDrawer = (props: DiagramDrawerProps): Diagram => {
    const config = props.config || defaultConfig;
    const { nodePaths, diagram } = props;

    let nodesList: DiagramNode[] = [];
    let arrowsList: DiagramArrow[] = [];

    nodePaths.map(path => {
        if (path.fullPath) {
            const numberNodePaths = nodePaths.filter(p => p.fullPath).length;
            const x = 0;
            const y = (numberNodePaths - 0.5 * nodePaths.filter(p => p.startNode === path.startNode).length) * config.nodeDimensions.height + config.verticalSpacing;

            const { nodes, arrows } = createNodesAndArrowsRecursively({
                diagram: diagram,
                nodePaths: nodePaths,
                config: config,
                currentNodePath: path,
                currentIndex: 0,
                startX: x,
                startY: y
            });
            nodesList = nodesList.concat(nodes);
            arrowsList = arrowsList.concat(arrows);
        }
    });

    return {
        nodes: nodesList.reduce((filtered: DiagramNode[], node: DiagramNode) => {
            let combinedY = 0;
            let count = 0;
            nodesList.forEach(n => {
                if (n.node === node.node) {
                    combinedY += n.centerPosition.y;
                    count++;
                }
            });
            combinedY /= count;
            if (!filtered.some(n => n.node === node.node)) {
                node.centerPosition.y = combinedY;
                filtered.push(node);
            }
            return filtered;
        }, []),
        arrows: arrowsList
    };
};

const createNodesAndArrowsRecursively = (props: NodesAndArrowsProps): { nodes: DiagramNode[], arrows: DiagramArrow[] } => {
    const { diagram, nodePaths, config, currentNodePath, currentIndex, startX, startY } = props;

    let nodesList: DiagramNode[] = [];
    let arrowsList: DiagramArrow[] = [];

    nodesList.push({
        centerPosition: { x: startX, y: startY },
        dimensions: config.nodeDimensions,
        node: diagram.nodes!.find(n => n.id === currentNodePath.nodes[currentIndex])?.id!,
    });

    const nodesStartingFromHere = nodePaths.filter(path => path.startNode === currentNodePath.nodes[currentIndex]);
    const height = (config.verticalSpacing + config.nodeDimensions.height) * (nodesStartingFromHere.length - 1);
    const newStartY = startY - height / 2;

    if (nodesStartingFromHere.length > 1) {
        nodesStartingFromHere.forEach((node, index) => {
            const { nodes, arrows } = createNodesAndArrowsRecursively({
                diagram: diagram,
                nodePaths: nodePaths,
                config: config,
                currentNodePath: node,
                currentIndex: 1,
                startX: startX + config.nodeDimensions.width + config.horizontalSpacing,
                startY: newStartY + index * (config.verticalSpacing + config.nodeDimensions.height),
            });
            nodesList = nodesList.concat(nodes);
            arrowsList = arrowsList.concat(arrows);
        })
    }
    else if (nodesStartingFromHere.length === 1) {
        const { nodes, arrows } = createNodesAndArrowsRecursively({
            diagram: diagram,
            nodePaths: nodePaths,
            config: config,
            currentNodePath: currentNodePath,
            currentIndex: currentIndex + 1,
            startX: startX + config.nodeDimensions.width + config.horizontalSpacing,
            startY: newStartY,
        });
        nodesList = nodesList.concat(nodes);
        arrowsList = arrowsList.concat(arrows);
    }
    return { nodes: nodesList, arrows: arrowsList };
};
