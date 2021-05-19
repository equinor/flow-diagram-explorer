import React from "react";
import dagre from "dagre";

import { FlowDiagram, FDNode } from "../types/nodes";
import { DiagramConfig } from "../types/diagram";
import { Size } from "../types/dimensions";
import { SceneItem, SceneItemPropsType } from "../components/SceneItem";
import { EdgeLabel } from "../components/EdgeLabel";

type DiagramDrawerProps = {
    flowDiagram: FlowDiagram;
    config?: DiagramConfig;
};

type Diagram = {
    sceneItems: React.ReactElement<SceneItemPropsType>[];
    sceneSize: Size;
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

    const sceneItems: React.ReactElement<SceneItemPropsType>[] = [];

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
            { label: flow.label, width: 300, height: 10, labelpos: "l", labeloffset: 12 },
            edge.flow
        );
    });

    dagre.layout(graph, { rankdir: "LR" });

    const sceneSize = {
        width: graph.graph().width ? graph.graph().width! : 0,
        height: graph.graph().height ? graph.graph().height! : 0
    };

    graph.nodes().forEach((v) => {
        const node = flowDiagram.nodes.find((node) => node.id === v)!;
        const { html, width, height } = node.render ? node.render(node) : defaultRenderNode(node);
        sceneItems.push(<SceneItem key={v} id={v} size={{ width: width, height: height }} position={{ x: graph.node(v).x, y: graph.node(v).y }} zIndex={3} children={html} />);
    });

    flowDiagram.flows.forEach((flow) => {
        const arrowHeadSize = flow.style.arrowHeadSize || 9;
        const svg = (
            <svg width={sceneSize.width} height={sceneSize.height}>
                <defs>
                    <marker
                        id={`arrow-${flow.id}`}
                        markerWidth={arrowHeadSize}
                        markerHeight={arrowHeadSize}
                        refX={arrowHeadSize}
                        refY={arrowHeadSize / 3}
                        orient="auto"
                        markerUnits="strokeWidth"
                        viewBox={`0 0 ${arrowHeadSize} ${arrowHeadSize}`}
                    >
                        <path d={`M0,0 L0,${arrowHeadSize * 2 / 3} L${arrowHeadSize},${arrowHeadSize / 3} z`} fill={flow.style.strokeColor} />
                    </marker>
                </defs>
            </svg>
        )
        sceneItems.push(<SceneItem key={`${flow.id}-defs`} id={`${flow.id}-defs`} size={{ width: sceneSize.width, height: sceneSize.height }} position={{ x: 0, y: 0 }} zIndex={0} children={svg} />);
    });

    graph.edges().forEach(function (v) {
        const flow = flowDiagram.flows.find((flow) => flow.id === v.name)!;
        const strokeWidth = flow.style.strokeWidth || 2;
        const arrowWidth = flow.style.arrowHeadSize || 16;
        const strokeColor = flow.style.strokeColor || "#000";
        const strokeStyle = flow.style.strokeStyle || "0";
        const width = Math.abs(graph.edge(v).points[0].x - graph.edge(v).points[graph.edge(v).points.length - 1].x) + arrowWidth * 2;
        const height = Math.abs(Math.max(...graph.edge(v).points.map(point => point.y)) - Math.min(...graph.edge(v).points.map(point => point.y))) + arrowWidth * 2;
        const left = Math.min(...graph.edge(v).points.map(point => point.x)) - arrowWidth;
        const top = Math.min(...graph.edge(v).points.map(point => point.y)) - arrowWidth;
        const points = graph.edge(v).points;
        const svg = (
            <svg width={width} height={height} style={{ marginLeft: -width / 2, marginTop: -height / 2 }}>
                <polyline
                    points={points.map((p) => `${p.x - left},${p.y - top}`).join(" ")}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeStyle}
                    markerEnd={`url(#arrow-${flow.id})`}
                />
            </svg>
        );
        sceneItems.push(<SceneItem key={`${flow.id}:${v.v}-${v.w}-edge`} id={`${flow.id}:${v.v}-${v.w}-edge`} size={{ width: width, height: height }} position={{ x: left + width / 2, y: top + height / 2 }} zIndex={2} children={svg} />);
        const label = (<EdgeLabel label={flow.label} size={{ width: graph.edge(v)["width"], height: graph.edge(v)["height"] }} />)
        sceneItems.push(<SceneItem key={`${flow.id}:${v.v}-${v.w}-label`} id={`${flow.id}:${v.v}-${v.w}-label`} size={{ width: graph.edge(v)["width"], height: graph.edge(v)["height"] }} position={{ x: graph.edge(v)["x"] + graph.edge(v)["width"] / 2, y: graph.edge(v)["y"] + graph.edge(v)["height"] / 2 }} zIndex={3} children={label} />);
    });

    return {
        sceneItems: sceneItems,
        sceneSize: sceneSize
    };
};
