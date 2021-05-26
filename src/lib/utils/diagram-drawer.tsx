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

type NodeFlowEdgeMap = {
    node: string;
    sourceNodes: string[];
    targetNodes: string[];
    flow: string;
};

export type Diagram = {
    sceneItems: React.ReactElement<SceneItemPropsType>[];
    sceneSize: Size;
    flowNodeEdgeMap: { id: string; edgeIndices: number[] }[];
};

const defaultConfig: DiagramConfig = {
    horizontalSpacing: 100,
    verticalSpacing: 100,
    nodeDimensions: { width: 200, height: 100 },
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
                    marginLeft: "-100px",
                }}
            >
                {node.title}
            </div>
        ),
        width: 200,
        height: 100,
    };
};

const renderJointNode = (): { html: JSX.Element; width: number; height: number } => {
    return {
        html: (
            <div
                style={{
                    width: 0,
                    height: 0,
                }}
            ></div>
        ),
        width: 0,
        height: 0,
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

    const nodeFlowEdgeMap: NodeFlowEdgeMap[] = [];
    flowDiagram.nodes.forEach((node) => {
        flowDiagram.flows.forEach((flow) => {
            const sourceNodes: string[] = [];
            const targetNodes: string[] = [];
            const edges = [...flowDiagram.edges.filter((edge) => edge.flow === flow.id)];
            let i = 0;
            while (i < edges.length) {
                const edge = edges[i];
                let edgeUsed = false;
                if (sourceNodes.includes(edge.from) || edge.from === node.id) {
                    if (!targetNodes.includes(edge.to)) {
                        targetNodes.push(edge.to);
                    }
                    edgeUsed = true;
                }
                if (targetNodes.includes(edge.to)) {
                    if (!sourceNodes.includes(edge.from)) {
                        sourceNodes.push(edge.from);
                    }
                    edgeUsed = true;
                }
                if (edgeUsed) {
                    edges.splice(i, 1);
                    i = 0;
                } else {
                    i++;
                }
            }
            nodeFlowEdgeMap.push({
                node: node.id,
                sourceNodes: sourceNodes,
                targetNodes: targetNodes,
                flow: flow.id,
            });
        });
    });

    const compareNodeArrays = (array1: string[], array2: string[]): boolean => {
        if (array1.length !== array2.length) {
            return false;
        }
        const newArray2 = [...array2];
        array1.forEach((value) => {
            const index = newArray2.indexOf(value, 0);
            if (index !== -1) {
                newArray2.splice(index, 1);
            }
        });
        return newArray2.length === 0;
    };

    const uniqueNodeFlowEdgeMap: NodeFlowEdgeMap[] = nodeFlowEdgeMap.reduce(
        (filtered: NodeFlowEdgeMap[], el: NodeFlowEdgeMap) => {
            if (
                !filtered.some(
                    (nf) =>
                        compareNodeArrays(nf.sourceNodes, el.sourceNodes) &&
                        compareNodeArrays(nf.targetNodes, el.targetNodes) &&
                        nf.flow === el.flow
                ) &&
                el.sourceNodes.length !== 0 &&
                el.targetNodes.length !== 0
            ) {
                filtered.push(el);
            }
            return filtered;
        },
        []
    );

    graph = new dagre.graphlib.Graph({ multigraph: true });
    graph.setGraph({ rankdir: "LR" });

    flowDiagram.nodes.forEach((node) => {
        const nodeMeta = node.render ? node.render(node) : defaultRenderNode(node);
        graph.setNode(node.id, { label: node.title, width: nodeMeta.width, height: nodeMeta.height });
    });

    const additionalFlowNodes: string[] = [];
    const additionalFlowNodesMap: { sourceNodes: string[]; targetNodes: string[]; edgeId: string }[] = [];

    uniqueNodeFlowEdgeMap.forEach((el) => {
        const flow = flowDiagram.flows.find((flow) => flow.id === el.flow)!;
        const nodeMeta = renderJointNode();
        graph.setNode(`${el.flow}-joint-${el.sourceNodes.join("-")}`, {
            label: "",
            width: nodeMeta.width,
            height: nodeMeta.height,
        });
        graph.setNode(`${el.flow}-split-${el.targetNodes.join("-")}`, {
            label: "",
            width: nodeMeta.width,
            height: nodeMeta.height,
        });
        additionalFlowNodes.push(`${el.flow}-joint-${el.sourceNodes.join("-")}`);
        additionalFlowNodes.push(`${el.flow}-split-${el.targetNodes.join("-")}`);
        additionalFlowNodesMap.push({
            sourceNodes: el.sourceNodes,
            targetNodes: el.targetNodes,
            edgeId: `${el.flow}-joint-${el.sourceNodes.join("-")}`,
        });
        additionalFlowNodesMap.push({
            sourceNodes: el.sourceNodes,
            targetNodes: el.targetNodes,
            edgeId: `${el.flow}-split-${el.targetNodes.join("-")}`,
        });
        el.sourceNodes.forEach((node) => {
            graph.setEdge(node, `${el.flow}-joint-${el.sourceNodes.join("-")}`, {}, el.flow);
        });
        el.targetNodes.forEach((node) => {
            graph.setEdge(`${el.flow}-split-${el.targetNodes.join("-")}`, node, {}, el.flow);
        });
        graph.setEdge(
            `${el.flow}-joint-${el.sourceNodes.join("-")}`,
            `${el.flow}-split-${el.targetNodes.join("-")}`,
            { label: flow.label, width: 300, height: 10, labelpos: "l", labeloffset: 12 },
            el.flow
        );
    });

    dagre.layout(graph, { rankdir: "LR" });

    const sceneSize = {
        width: graph.graph().width ? graph.graph().width! : 0,
        height: graph.graph().height ? graph.graph().height! : 0,
    };

    graph.nodes().forEach((v) => {
        const node = flowDiagram.nodes.find((node) => node.id === v) || { id: v, render: renderJointNode };
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
                zIndex={8}
                children={html}
                clickable={true}
                hoverable={true}
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
                        refX={arrowHeadSize - 1}
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

    const sortNodesByYCoordinate = (
        nodeA: { node: string; position: Point },
        nodeB: { node: string; position: Point }
    ): number => {
        return nodeA.position.y - nodeB.position.y;
    };

    let edgeIndex = 0;
    const flowNodeEdgeIndicesMap: { id: string; edgeIndices: number[] }[] = flowDiagram.nodes.map((node) => ({
        id: node.id,
        edgeIndices: [],
    }));
    flowDiagram.flows.forEach((flow) => {
        flowNodeEdgeIndicesMap.push({ id: `flow-${flow.id}`, edgeIndices: [] });
    });

    graph.edges().forEach((edge) => {
        const flow = flowDiagram.flows.find((flow) => flow.id === edge.name)!;

        const sourceNodes: { node: string; position: Point }[] = graph
            .edges()
            .filter((el) => el.w === edge.w)
            .map((el) => ({ node: el.v, position: graph.edge(el).points[0] }));

        sourceNodes.sort(sortNodesByYCoordinate);
        const targetNodes: { node: string; position: Point }[] = graph
            .edges()
            .filter((el) => el.v === edge.v)
            .map((el) => ({ node: el.w, position: graph.edge(el).points[graph.edge(el).points.length - 1] }));
        targetNodes.sort(sortNodesByYCoordinate);

        const strokeWidth = flow.style.strokeWidth || 2;
        const arrowWidth = flow.style.arrowHeadSize || 16;
        const strokeColor = flow.style.strokeColor || "#000";
        const strokeStyle = flow.style.strokeStyle || "0";

        const inputPoint = additionalFlowNodes.includes(edge.w)
            ? graph.edge(edge).points[graph.edge(edge).points.length - 1]
            : {
                  x: graph.node(edge.w).x - graph.node(edge.w).width / 2,
                  y:
                      graph.node(edge.w).y -
                      graph.node(edge.w).height / 2 +
                      (graph.node(edge.w).height / (sourceNodes.length + 1)) *
                          (sourceNodes.findIndex((el) => el.node === edge.v) + 1),
              };
        const outputPoint = additionalFlowNodes.includes(edge.v)
            ? graph.edge(edge).points[0]
            : {
                  x: graph.node(edge.v).x + graph.node(edge.v).width / 2,
                  y:
                      graph.node(edge.v).y -
                      graph.node(edge.v).height / 2 +
                      (graph.node(edge.v).height / (targetNodes.length + 1)) *
                          (targetNodes.findIndex((el) => el.node === edge.w) + 1),
              };

        const points: Point[] = [];
        if (!additionalFlowNodes.includes(edge.v) && additionalFlowNodes.includes(edge.w)) {
            points.push(outputPoint);
            points.push({ x: graph.edge(edge).points[graph.edge(edge).points.length - 1].x, y: outputPoint.y });
            points.push(graph.edge(edge).points[graph.edge(edge).points.length - 1]);
            flowNodeEdgeIndicesMap.find((el) => el.id === edge.v)!.edgeIndices.push(edgeIndex);
            additionalFlowNodesMap.forEach((el) => {
                if (el.edgeId === edge.w) {
                    el.targetNodes.forEach((node) =>
                        flowNodeEdgeIndicesMap.find((entry) => entry.id === node)!.edgeIndices.push(edgeIndex)
                    );
                }
            });
        } else if (additionalFlowNodes.includes(edge.v) && additionalFlowNodes.includes(edge.w)) {
            points.push(graph.edge(edge).points[0]);
            points.push(graph.edge(edge).points[graph.edge(edge).points.length - 1]);
            additionalFlowNodesMap.forEach((el) => {
                if (el.edgeId === edge.w || el.edgeId === edge.v) {
                    el.targetNodes.forEach((node) =>
                        flowNodeEdgeIndicesMap.find((entry) => entry.id === node)!.edgeIndices.push(edgeIndex)
                    );
                    el.sourceNodes.forEach((node) =>
                        flowNodeEdgeIndicesMap.find((entry) => entry.id === node)!.edgeIndices.push(edgeIndex)
                    );
                }
            });
        } else if (additionalFlowNodes.includes(edge.v) && !additionalFlowNodes.includes(edge.w)) {
            points.push(graph.edge(edge).points[0]);
            points.push({ x: graph.edge(edge).points[0].x, y: inputPoint.y });
            points.push(inputPoint);
            flowNodeEdgeIndicesMap.find((el) => el.id === edge.w)!.edgeIndices.push(edgeIndex);
            additionalFlowNodesMap.forEach((el) => {
                if (el.edgeId === edge.v) {
                    el.sourceNodes.forEach((node) =>
                        flowNodeEdgeIndicesMap.find((entry) => entry.id === node)!.edgeIndices.push(edgeIndex)
                    );
                }
            });
        }

        const width =
            Math.abs(Math.max(...points.map((p) => p.x)) - Math.min(...points.map((p) => p.x))) + 2 * arrowWidth;
        const height =
            Math.abs(Math.max(...points.map((p) => p.y)) - Math.min(...points.map((p) => p.y))) + 2 * arrowWidth;
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
                    markerEnd={
                        additionalFlowNodes.includes(edge.v) && !additionalFlowNodes.includes(edge.w)
                            ? `url(#arrow-${flow.id})`
                            : undefined
                    }
                />
            </svg>
        );
        sceneItems.push(
            <SceneItem
                key={`${flow.id}:${edge.v}-${edge.w}-edge`}
                id={`edge-${edgeIndex}`}
                size={{ width: width, height: height }}
                position={{ x: left + width / 2, y: top + height / 2 }}
                zIndex={2}
                children={svg}
                clickable={false}
            />
        );

        flowNodeEdgeIndicesMap.find((el) => el.id === `flow-${flow.id}`)!.edgeIndices.push(edgeIndex);
        edgeIndex++;

        if (additionalFlowNodes.includes(edge.v) && additionalFlowNodes.includes(edge.w)) {
            const label = (
                <EdgeLabel
                    label={flow.label}
                    size={{ width: graph.edge(edge)["width"], height: graph.edge(edge)["height"] }}
                />
            );
            const node1 = graph.node(edge.v);
            const node2 = graph.node(edge.w);
            sceneItems.push(
                <SceneItem
                    key={`${flow.id}:${edge.v}-${edge.w}-label`}
                    id={`flow-${flow.id}`}
                    size={{ width: graph.edge(edge)["width"], height: graph.edge(edge)["height"] }}
                    position={{
                        x: node1.x + (node2.x - node1.x) / 2,
                        y: node1.y - graph.edge(edge)["height"],
                    }}
                    zIndex={6}
                    children={label}
                    clickable={true}
                    hoverable={true}
                />
            );
        }
    });

    /*
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
        const points = [outputPoint, bendPoint, inputPoint];
        const width = Math.abs(outputPoint.x - inputPoint.x) + 2 * arrowWidth;
        const height =
            Math.abs(Math.max(...points.map((p) => p.y)) - Math.min(...points.map((p) => p.y))) + 2 * arrowWidth;
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
        const points: { x: number; y: number }[] = graph
            .edge(v)
            .points.filter((p, i) => i === 0 || i === graph.edge(v).points.length - 1);
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
        sceneSize: sceneSize,
        flowNodeEdgeMap: flowNodeEdgeIndicesMap,
    };
};
