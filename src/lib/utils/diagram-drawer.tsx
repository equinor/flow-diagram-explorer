import React from "react";
import dagre from "dagre";

import { FlowDiagram, FDNode, Edge } from "../types/nodes";
import { DiagramConfig } from "../types/diagram";
import { Size } from "../types/dimensions";
import { SceneItem, SceneItemPropsType } from "../components/SceneItem";
import { EdgeLabel } from "../components/EdgeLabel";
import { Point } from "../types/point";

type DiagramDrawerProps = {
    flowDiagram: FlowDiagram;
    config?: DiagramConfig;
};

export type Diagram = {
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
        const flows = flowDiagram.edges
            .reduce((filtered: Edge[], edge: Edge) => {
                if (!filtered.some((el) => el.flow === edge.flow) && (edge.from === v || edge.to === v)) {
                    filtered.push(edge);
                }
                return filtered;
            }, [])
            .map((el) => el.flow);
        sceneItems.push(
            <SceneItem
                key={v}
                id={v}
                size={{ width: width, height: height }}
                position={{ x: graph.node(v).x, y: graph.node(v).y }}
                zIndex={3}
                children={html}
                clickable={true}
                hoverable={true}
                connectedFlows={flows}
            />
        );
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
                        <path
                            d={`M0,0 L0,${(arrowHeadSize * 2) / 3} L${arrowHeadSize},${arrowHeadSize / 3} z`}
                            fill={flow.style.strokeColor}
                        />
                    </marker>
                </defs>
            </svg>
        );
        sceneItems.push(
            <SceneItem
                key={`${flow.id}-defs`}
                id={`${flow.id}-defs`}
                size={{ width: sceneSize.width, height: sceneSize.height }}
                position={{ x: 0, y: 0 }}
                zIndex={0}
                children={svg}
                clickable={false}
            />
        );
    });

    const nodeFlowInputPoints: { node: string; flow: string; bendPosition: Point; inputPosition: Point }[] = [];
    const nodeFlowOutputPoints: { node: string; flow: string; bendPosition: Point; outputPosition: Point }[] = [];

    const bendPositionDistance = 50;
    const bendPositionLength = 50;

    graph.nodes().forEach((nodeId) => {
        const node = graph.node(nodeId);
        const inputFlows = flowDiagram.edges
            .reduce(
                (filtered: Edge[], edge: Edge) =>
                    filtered.some((e) => e.flow === edge.flow) || edge.to !== nodeId ? filtered : [...filtered, edge],
                []
            )
            .map((edge) => edge.flow);
        inputFlows.sort();
        inputFlows.forEach((flow, index) => {
            nodeFlowInputPoints.push({
                node: nodeId,
                flow: flow,
                bendPosition: {
                    x:
                        node.x -
                        node.width / 2 -
                        bendPositionDistance -
                        bendPositionLength / 2 +
                        (bendPositionLength / (inputFlows.length + 1)) * (index + 1),
                    y: node.y - node.height / 2 + (node.height / (inputFlows.length + 1)) * (index + 1)
                },
                inputPosition: {
                    x: node.x - node.width / 2,
                    y: node.y - node.height / 2 + (node.height / (inputFlows.length + 1)) * (index + 1)
                }
            });
        });
        const outputFlows = flowDiagram.edges
            .reduce(
                (filtered: Edge[], edge: Edge) =>
                    filtered.some((e) => e.flow === edge.flow) || edge.from !== nodeId ? filtered : [...filtered, edge],
                []
            )
            .map((edge) => edge.flow);
        outputFlows.sort();
        outputFlows.forEach((flow, index) => {
            nodeFlowOutputPoints.push({
                node: nodeId,
                flow: flow,
                bendPosition: {
                    x:
                        node.x +
                        node.width / 2 +
                        bendPositionDistance -
                        bendPositionLength / 2 +
                        (bendPositionLength / (inputFlows.length + 1)) * (index + 1),
                    y: node.y - node.height / 2 + (node.height / (inputFlows.length + 1)) * (index + 1)
                },
                outputPosition: {
                    x: node.x + node.width / 2,
                    y: node.y - node.height / 2 + (node.height / (inputFlows.length + 1)) * (index + 1)
                }
            });
        });
    });

    const nodeFlowEdgeMap: { node: string; sourceNodes: string[]; targetNodes: string[]; flow: string }[] = [];
    flowDiagram.nodes.forEach((node) => {
        flowDiagram.flows.forEach((flow) => {
            const sourceNodes: string[] = [node.id];
            const targetNodes: string[] = [node.id];
            let edges = [...flowDiagram.edges.filter((edge) => edge.flow === flow.id)];
            for (let i = 0; i < edges.length; i++) {
                const edge = edges[i];
                if (sourceNodes.includes(edge.from)) {
                    targetNodes.push(edge.to);
                    edges = edges.splice(i, 1);
                    i = 0;
                } else if (targetNodes.includes(edge.to)) {
                    sourceNodes.push(edge.from);
                    edges = edges.splice(i, 1);
                    i = 0;
                }
            }
            nodeFlowEdgeMap.push({
                node: node.id,
                sourceNodes: sourceNodes,
                targetNodes: targetNodes,
                flow: flow.id
            });
        });
    });

    const flowJointPoints: { flow: string; fromNode: string; toNode: string; position: Point }[] = [];
    const flowSplitPoints: { flow: string; fromNode: string; toNode: string; position: Point }[] = [];

    flowDiagram.edges.forEach((edge) => {
        const nodeFlowOutputPoint = nodeFlowOutputPoints.find((el) => el.node === edge.from && el.flow === edge.flow)!;
        const allOutputPoints = nodeFlowOutputPoints.filter((el) =>
            nodeFlowEdgeMap.find((nf) => nf.node === edge.from)!.sourceNodes.includes(el.node)
        );
        const maxY = Math.max(...allOutputPoints.map((el) => el.bendPosition.y));
        const minY = Math.min(...allOutputPoints.map((el) => el.bendPosition.y));
        flowJointPoints.push({
            flow: edge.flow,
            fromNode: edge.from,
            toNode: edge.to,
            position: {
                x: nodeFlowOutputPoint.bendPosition.x,
                y: minY + (maxY - minY) / 2
            }
        });
    });

    flowDiagram.edges.forEach((edge) => {
        const nodeFlowInputPoint = nodeFlowInputPoints.find((el) => el.node === edge.to && el.flow === edge.flow)!;
        const allInputPoints = nodeFlowInputPoints.filter((el) =>
            nodeFlowEdgeMap.find((nf) => nf.node === edge.to)!.targetNodes.includes(el.node)
        );
        const maxY = Math.max(...allInputPoints.map((el) => el.bendPosition.y));
        const minY = Math.min(...allInputPoints.map((el) => el.bendPosition.y));
        flowSplitPoints.push({
            flow: edge.flow,
            fromNode: edge.from,
            toNode: edge.to,
            position: {
                x: nodeFlowInputPoint.bendPosition.x,
                y: minY + (maxY - minY) / 2
            }
        });
    });

    flowDiagram.edges.forEach((edge) => {
        const flow = flowDiagram.flows.find((flow) => flow.id === edge.flow)!;

        const strokeWidth = flow.style.strokeWidth || 2;
        const arrowWidth = flow.style.arrowHeadSize || 16;
        const strokeColor = flow.style.strokeColor || "#000";
        const strokeStyle = flow.style.strokeStyle || "0";

        const nodeFlowOutputPoint = nodeFlowOutputPoints.find((el) => el.node === edge.from && el.flow === edge.flow)!;
        const nodeFlowInputPoint = nodeFlowInputPoints.find((el) => el.node === edge.to && el.flow === edge.flow)!;
        const endBendPoint = nodeFlowInputPoint.bendPosition;
        const startBendPoint = nodeFlowOutputPoint.bendPosition;
        const inputPoint = nodeFlowInputPoint.inputPosition;
        const outputPoint = nodeFlowOutputPoint.outputPosition;
        const jointPoint = flowJointPoints.find((el) => el.fromNode === edge.from && el.flow === edge.flow)!.position;
        const splitPoint = flowSplitPoints.find((el) => el.toNode == edge.to && el.flow === edge.flow)!.position;
        const points = [outputPoint, startBendPoint, jointPoint, splitPoint, endBendPoint, inputPoint];
        const width = Math.abs(outputPoint.x - inputPoint.x);
        const height = Math.abs(Math.max(...points.map((p) => p.y)) - Math.min(...points.map((p) => p.y)));
        const left = Math.min(...points.map((point) => point.x)) - arrowWidth;
        const top = Math.min(...points.map((point) => point.y)) - arrowWidth;
        const svg = (
            <svg width={width} height={height} style={{ marginLeft: -width / 2, marginTop: -height / 2 }}>
                <polyline
                    points={points.map((p) => `${p.x - left},${p.y - top}`).join(" ")}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeStyle}
                />
            </svg>
        );
        sceneItems.push(
            <SceneItem
                key={`${flow.id}:${edge.from}-${edge.to}-edge`}
                id={`${flow.id}:${edge.from}-${edge.to}-edge`}
                size={{ width: width, height: height }}
                position={{ x: left + width / 2, y: top + height / 2 }}
                zIndex={2}
                children={svg}
                clickable={false}
            />
        );
    });

    /*

    const nodeFlowMap: {
        node: string;
        flow: string;
        flowInputPoint?: Point;
        flowCollectionPoint?: Point;
        flowOutputPoint?: Point;
    }[] = [];
    graph.nodes().forEach((v) => {
        const inputFlows = flowDiagram.edges.reduce((filtered: Edge[], edge: Edge) => {
            if (filtered.some((e) => e.flow === edge.flow) || edge.to !== v) {
                return filtered;
            } else {
                return [...filtered, edge];
            }
        }, []);
        const nodeEdgeLength = graph.node(v).height;
        let distance = nodeEdgeLength / (inputFlows.length + 1);
        const delta = 50;
        let horizontalDistance = (inputFlows.length / 2) * delta;
        inputFlows.forEach((flow, index) => {
            nodeFlowMap.push({
                node: v,
                flow: flow.flow,
                flowInputPoint: {
                    x: graph.node(v).x - graph.node(v).width / 2,
                    y: graph.node(v).y - graph.node(v).height / 2 + (index + 1) * distance
                },
                flowCollectionPoint: {
                    x:
                        graph.node(v).x -
                        Math.abs(graph.node(v).x - graph.node(flow.from).x) / 2 -
                        horizontalDistance +
                        index * delta,
                    y: graph.node(v).y - graph.node(v).height / 2 + (index + 1) * distance
                },
                flowOutputPoint: undefined
            });
        });
        const outputFlows = flowDiagram.edges.reduce(
            (filtered: Edge[], edge: Edge) =>
                filtered.some((e) => e.flow === edge.flow) || edge.from !== v ? filtered : [...filtered, edge],
            []
        );
        distance = nodeEdgeLength / (outputFlows.length + 1);
        outputFlows.forEach((flow, index) => {
            const el = nodeFlowMap.find((el) => el.flow === flow.flow && el.node === v);
            if (el) {
                el.flowOutputPoint = {
                    x: graph.node(v).x + graph.node(v).width / 2,
                    y: graph.node(v).y - graph.node(v).height / 2 + (index + 1) * distance
                };
            } else {
                nodeFlowMap.push({
                    node: v,
                    flow: flow.flow,
                    flowInputPoint: undefined,
                    flowCollectionPoint: undefined,
                    flowOutputPoint: {
                        x: graph.node(v).x + graph.node(v).width / 2,
                        y: graph.node(v).y - graph.node(v).height / 2 + (index + 1) * distance
                    }
                });
            }
        });
    });

    flowDiagram.edges.forEach((edge) => {
        const flow = flowDiagram.flows.find((flow) => flow.id === edge.flow)!;
        const strokeWidth = flow.style.strokeWidth || 2;
        const arrowWidth = flow.style.arrowHeadSize || 16;
        const strokeColor = flow.style.strokeColor || "#000";
        const strokeStyle = flow.style.strokeStyle || "0";
        const fromPoint = nodeFlowMap.find((el) => el.node === edge.from && el.flow === edge.flow)!.flowOutputPoint!;
        const toPoint = nodeFlowMap.find((el) => el.node === edge.to && el.flow === edge.flow)!.flowInputPoint!;
        const collectionPoint = nodeFlowMap.find((el) => el.node === edge.to && el.flow === edge.flow)!
            .flowCollectionPoint!;
        const turnPoint = { x: collectionPoint.x, y: fromPoint.y };
        const width = Math.abs(fromPoint.x - toPoint.x) + arrowWidth * 2;
        const height = Math.abs(fromPoint.y - toPoint.y) + arrowWidth * 2;
        const points: { x: number; y: number }[] = [fromPoint, turnPoint, collectionPoint];
        const left = Math.min(...points.map((point) => point.x)) - arrowWidth;
        const top = Math.min(...points.map((point) => point.y)) - arrowWidth;
        const svg = (
            <svg width={width} height={height} style={{ marginLeft: -width / 2, marginTop: -height / 2 }}>
                <polyline
                    points={points.map((p) => `${p.x - left},${p.y - top}`).join(" ")}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeStyle}
                />
            </svg>
        );
        sceneItems.push(
            <SceneItem
                key={`${flow.id}:${edge.from}-${edge.to}-edge`}
                id={`${flow.id}:${edge.from}-${edge.to}-edge`}
                size={{ width: width, height: height }}
                position={{ x: left + width / 2, y: top + height / 2 }}
                zIndex={2}
                children={svg}
                clickable={false}
            />
        );
    });

    nodeFlowMap
        .filter((el) => el.flowInputPoint)
        .forEach((el) => {
            const flow = flowDiagram.flows.find((flow) => flow.id === el.flow)!;
            const strokeWidth = flow.style.strokeWidth || 2;
            const arrowWidth = flow.style.arrowHeadSize || 16;
            const strokeColor = flow.style.strokeColor || "#000";
            const strokeStyle = flow.style.strokeStyle || "0";
            const label = <EdgeLabel label={flow.label} size={{ width: 300, height: 20 }} />;
            let left = el.flowCollectionPoint!.x + Math.abs(el.flowInputPoint!.x - el.flowCollectionPoint!.x) / 2;
            let top = el.flowCollectionPoint!.y;
            let width = 300;
            let height = 20;
            sceneItems.push(
                <SceneItem
                    key={`${flow.id}:${el.node}-label`}
                    id={`${flow.id}:${el.node}-label`}
                    size={{ width: 300, height: 20 }}
                    position={{
                        x: left,
                        y: top - height / 2
                    }}
                    zIndex={3}
                    children={label}
                    clickable={true}
                    hoverable={true}
                    connectedFlows={[flow.id]}
                />
            );
            const points: { x: number; y: number }[] = [el.flowCollectionPoint!, el.flowInputPoint!];
            width = Math.abs(el.flowCollectionPoint!.x - el.flowInputPoint!.x) + arrowWidth * 2;
            height = Math.abs(el.flowCollectionPoint!.y - el.flowInputPoint!.y) + arrowWidth * 2;
            left = Math.min(...points.map((point) => point.x)) - arrowWidth;
            top = Math.min(...points.map((point) => point.y)) - arrowWidth;
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
            const allConnectedNodes = flowDiagram.edges.filter((edg) => edg.to === el.node).map((edg) => edg.from);
            sceneItems.push(
                <SceneItem
                    key={`${flow.id}:${el.node}-${allConnectedNodes.join("-")}-inputedge`}
                    id={`${flow.id}:${el.node}-${allConnectedNodes.join("-")}-inputedge`}
                    size={{ width: width, height: height }}
                    position={{ x: left + width / 2, y: top + height / 2 }}
                    zIndex={2}
                    children={svg}
                    clickable={false}
                />
            );
        });

    */

    /*
    graph.edges().forEach(function (v) {
        const flow = flowDiagram.flows.find((flow) => flow.id === v.name)!;
        const strokeWidth = flow.style.strokeWidth || 2;
        const arrowWidth = flow.style.arrowHeadSize || 16;
        const strokeColor = flow.style.strokeColor || "#000";
        const strokeStyle = flow.style.strokeStyle || "0";
        const width =
            Math.abs(graph.edge(v).points[0].x - graph.edge(v).points[graph.edge(v).points.length - 1].x) +
            arrowWidth * 2;
        const height =
            Math.abs(
                Math.max(...graph.edge(v).points.map((point) => point.y)) -
                    Math.min(...graph.edge(v).points.map((point) => point.y))
            ) +
            arrowWidth * 2;
        const left = Math.min(...graph.edge(v).points.map((point) => point.x)) - arrowWidth;
        const top = Math.min(...graph.edge(v).points.map((point) => point.y)) - arrowWidth;
        const points: {x: number, y: number}[] = graph.edge(v).points.filter((p, i) => i === 0 || i === graph.edge(v).points.length - 1);
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
        sceneItems.push(
            <SceneItem
                key={`${flow.id}:${v.v}-${v.w}-edge`}
                id={`${flow.id}:${v.v}-${v.w}-edge`}
                size={{ width: width, height: height }}
                position={{ x: left + width / 2, y: top + height / 2 }}
                zIndex={2}
                children={svg}
            />
        );
        const label = (
            <EdgeLabel label={flow.label} size={{ width: graph.edge(v)["width"], height: graph.edge(v)["height"] }} />
        );
        sceneItems.push(
            <SceneItem
                key={`${flow.id}:${v.v}-${v.w}-label`}
                id={`${flow.id}:${v.v}-${v.w}-label`}
                size={{ width: graph.edge(v)["width"], height: graph.edge(v)["height"] }}
                position={{
                    x: graph.edge(v)["x"] + graph.edge(v)["width"] / 2,
                    y: graph.edge(v)["y"] + graph.edge(v)["height"] / 2
                }}
                zIndex={3}
                children={label}
            />
        );
    });
    */

    return {
        sceneItems: sceneItems,
        sceneSize: sceneSize
    };
};
