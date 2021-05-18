import React from "react";
import dagre from "dagre";

import { FlowDiagram, FDNode } from "../types/nodes";
import { DiagramConfig, DiagramNode, DiagramArrow } from "../types/diagram";
import { Size } from "../types/dimensions";

type DiagramDrawerProps = {
    flowDiagram: FlowDiagram;
    config?: DiagramConfig;
};

type Diagram = {
    nodes: DiagramNode[];
    arrows: DiagramArrow[];
    size: Size;
};

const defaultConfig: DiagramConfig = {
    horizontalSpacing: 100,
    verticalSpacing: 100,
    nodeDimensions: { width: 200, height: 100 }
};

const defaultRenderNode = (node: FDNode): { html: JSX.Element; width: number; height: number } => {
    return {
        html: (
            <div
                style={{
                    textAlign: "center",
                    verticalAlign: "middle",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#ccc",
                    border: "1px black solid",
                    width: "200px",
                    height: "100px",
                    marginTop: "-50px",
                    marginLeft: "-100px"
                }}
            >
                {node.title}
            </div>
        ),
        width: 200,
        height: 100
    };
};

export const DiagramDrawer = (props: DiagramDrawerProps): Diagram => {
    const config = props.config || defaultConfig;
    const { flowDiagram } = props;

    let graph = new dagre.graphlib.Graph({ multigraph: true });
    graph.setGraph({ rankdir: "LR" });

    flowDiagram.nodes.forEach((node) => {
        const nodeMeta = node.render ? node.render(node) : defaultRenderNode(node);
        graph.setNode(node.id, { label: node.title, width: nodeMeta.width, height: nodeMeta.height });
    });
    flowDiagram.edges.forEach((edge) => {
        const flow = flowDiagram.flows.find((flow) => flow.id === edge.flow)!;
        graph.setEdge(
            edge.from,
            edge.to,
            { label: flow.label, width: 200, height: 10, labelpos: "l", labeloffset: 12 },
            edge.flow
        );
    });

    dagre.layout(graph, { rankdir: "LR" });

    const result: { nodes: DiagramNode[]; arrows: DiagramArrow[] } = { nodes: [], arrows: [] };
    graph.nodes().forEach(function (v) {
        const node = flowDiagram.nodes.find((node) => node.id === v)!;
        const { width, height, html } = node.render ? node.render(node) : defaultRenderNode(node);
        result.nodes.push({
            id: v,
            centerPosition: { x: graph.node(v).x, y: graph.node(v).y },
            html: html,
            size: { width: width, height: height }
        });
    });
    graph.edges().forEach(function (v) {
        const flow = flowDiagram.flows.find((flow) => flow.id === v.name)!;
        result.arrows.push({
            flow: flow,
            points: graph.edge(v).points,
            label: flow.label,
            labelPosition: { x: graph.edge(v)["x"], y: graph.edge(v)["y"] }
        });
    });

    let nodesList: DiagramNode[] = result.nodes;
    let arrowsList: DiagramArrow[] = result.arrows;

    return {
        nodes: nodesList,
        arrows: arrowsList,
        size: {
            width: graph.graph().width ? graph.graph().width! : 0,
            height: graph.graph().height ? graph.graph().height! : 0
        }
    };
};
