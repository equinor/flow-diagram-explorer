import { FlowDiagram } from '../types/nodes';
import { DiagramConfig, DiagramNode, DiagramArrow } from "../types/diagram";
import { DagreGraphLayouter } from './node-path-algorithm';

type DiagramDrawerProps = {
    diagram: FlowDiagram;
    config?: DiagramConfig;
};

type Diagram = {
    nodes: DiagramNode[];
    arrows: DiagramArrow[];
};

const defaultConfig: DiagramConfig = {
    horizontalSpacing: 100,
    verticalSpacing: 100,
    nodeDimensions: { width: 200, height: 100 },
}

export const DiagramDrawer = (props: DiagramDrawerProps): Diagram => {
    const config = props.config || defaultConfig;
    const { diagram } = props;

    const result = DagreGraphLayouter(diagram);
    let nodesList: DiagramNode[] = result.nodes;
    let arrowsList: DiagramArrow[] = result.arrows;

    /*
    nodesList = nodesList.map(node => ({
        centerPosition: { x: node.centerPosition.x, y: node.centerPosition.y },
        dimensions: config.nodeDimensions,
        node: node.node
    }));

    diagram.edges.forEach(edge => {
        const startPosition = nodesList.find(el => el.node === edge.from)!.centerPosition;
        const endPosition = nodesList.find(el => el.node === edge.to)!.centerPosition;
        arrowsList.push({
            startPosition: { x: startPosition.x + config.nodeDimensions.width / 2, y: startPosition.y },
            endPosition: { x: endPosition.x - config.nodeDimensions.width / 2, y: endPosition.y },
            startNode: edge.from
        });
    });
    */

    return {
        nodes: nodesList,
        arrows: arrowsList
    };
};
