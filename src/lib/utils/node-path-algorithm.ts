import {waterinj} from "../../demo/examples/water-injection";

import { FlowDiagram } from '../types/nodes';
import { NodePath } from '../types/nodepath';
import { stringify } from "querystring";

export const FlowDiagramParser = (flowDiagram: FlowDiagram): NodePath[] => {
    const nodePaths: NodePath[] = [];
    let lastNodes: string[] = [];
    if (flowDiagram.edges) { // edges should maybe always be defined?
        flowDiagram.edges.forEach(({from, to}) => {
            if (lastNodes.includes(from)) {
                lastNodes = lastNodes.map((el, index) => {
                    if (el === from) {
                        nodePaths[index].nodes.push(to);
                        return to;
                    }
                    else {
                        return from;
                    }
                });
            }
            else {
                nodePaths
            }
        })
    }
    return nodePaths;
}
