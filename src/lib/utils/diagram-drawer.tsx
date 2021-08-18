import React from "react";
import dagre from "dagre";

import { FlowDiagram, FlowDiagramNode } from "../types/diagram";
import { DiagramConfig } from "../types/diagram";
import { Size } from "../types/size";
import { SceneItem, SceneItemPropsType, SceneItemType } from "../components/SceneItem";
import { EdgeLabel } from "../components/EdgeLabel";
import { Point } from "../types/point";
import { DebugConsole } from "./debug";

type NodeFlowEdgeMap = {
    node: string;
    sourceNodes: string[];
    targetNodes: string[];
    flow: string;
};

type AdditionalFlowNodesMapItem = { sourceNodes: string[]; targetNodes: string[]; edgeId: string };
type FlowNodeEdgeIndicesMapItem = { id: string; edgeIndices: number[] };
type AdjustedPoint = { startNode: string; position: Point };

export type Diagram = {
    sceneItems: React.ReactElement<SceneItemPropsType>[];
    sceneSize: Size;
    flowNodeEdgeMap: { id: string; edgeIndices: number[] }[];
};

export class DiagramDrawer {
    private flowDiagram: FlowDiagram;
    private config: DiagramConfig;
    private renderJointNode = (): { html: JSX.Element; width: number; height: number } => {
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
    private renderDefaultNode = (node: FlowDiagramNode): { html: JSX.Element; width: number; height: number } => {
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
    private additionalFlowNodes: string[];
    private additionalFlowNodesMap: AdditionalFlowNodesMapItem[];
    private flowNodeEdgeIndicesMap: FlowNodeEdgeIndicesMapItem[];
    private sceneItems: React.ReactElement<SceneItemPropsType>[];
    private sceneSize: Size;

    constructor(flowDiagram: FlowDiagram, config: DiagramConfig) {
        this.flowDiagram = flowDiagram;
        this.config = config;
        this.sceneItems = [];
        this.additionalFlowNodes = [];
        this.additionalFlowNodesMap = [];
        this.flowNodeEdgeIndicesMap = [];
        this.sceneSize = { width: 0, height: 0 };
    }

    private compareNodeArrays(array1: string[], array2: string[]): boolean {
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
    }

    private sortNodesByYCoordinate(
        nodeA: { node: string; position: Point },
        nodeB: { node: string; position: Point }
    ): number {
        return nodeA.position.y - nodeB.position.y;
    }

    private makeAdditionalFlowNodes(graph: dagre.graphlib.Graph): void {
        this.additionalFlowNodes = [];
        this.additionalFlowNodesMap = [];

        const nodeFlowEdgeMap: NodeFlowEdgeMap[] = [];
        this.flowDiagram.nodes.forEach((node) => {
            this.flowDiagram.flows.forEach((flow) => {
                const sourceNodes: string[] = [];
                const targetNodes: string[] = [];
                const edges = [...this.flowDiagram.edges.filter((edge) => edge.flow === flow.id)];
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

        const uniqueNodeFlowEdgeMap: NodeFlowEdgeMap[] = nodeFlowEdgeMap.reduce(
            (filtered: NodeFlowEdgeMap[], el: NodeFlowEdgeMap) => {
                if (
                    !filtered.some(
                        (nf) =>
                            this.compareNodeArrays(nf.sourceNodes, el.sourceNodes) &&
                            this.compareNodeArrays(nf.targetNodes, el.targetNodes) &&
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

        uniqueNodeFlowEdgeMap.forEach((el) => {
            const flow = this.flowDiagram.flows.find((flow) => flow.id === el.flow);
            if (flow) {
                const nodeMeta = this.renderJointNode();
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
                this.additionalFlowNodes.push(`${el.flow}-joint-${el.sourceNodes.join("-")}`);
                this.additionalFlowNodes.push(`${el.flow}-split-${el.targetNodes.join("-")}`);
                this.additionalFlowNodesMap.push({
                    sourceNodes: el.sourceNodes,
                    targetNodes: el.targetNodes,
                    edgeId: `${el.flow}-joint-${el.sourceNodes.join("-")}`,
                });
                this.additionalFlowNodesMap.push({
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
            } else {
                DebugConsole.error(`Could not find flow with id '${el.flow}' - skipping.`);
            }
        });
    }

    private makeGraph(): dagre.graphlib.Graph {
        const graph = new dagre.graphlib.Graph({ multigraph: true });
        graph.setGraph({ rankdir: "LR", ranksep: this.config.horizontalSpacing, nodesep: this.config.verticalSpacing });

        this.flowDiagram.nodes.forEach((node) => {
            const nodeMeta = node.render ? node.render(node) : this.renderDefaultNode(node);
            graph.setNode(node.id, { label: node.title, width: nodeMeta.width, height: nodeMeta.height });
        });

        this.makeAdditionalFlowNodes(graph);

        dagre.layout(graph, { rankdir: "LR" });

        return graph;
    }

    private makeNodes(graph: dagre.graphlib.Graph): void {
        graph.nodes().forEach((v) => {
            const node = this.flowDiagram.nodes.find((node) => node.id === v) || {
                id: v,
                render: this.renderJointNode,
            };
            const { html, width, height } = node.render ? node.render(node) : this.renderDefaultNode(node);
            this.sceneItems.push(
                <SceneItem
                    key={v}
                    id={v}
                    type={SceneItemType.Node}
                    size={{ width: width, height: height }}
                    position={{ x: graph.node(v).x, y: graph.node(v).y }}
                    zIndex={8}
                    children={html}
                    clickable={true}
                    hoverable={true}
                />
            );
        });
    }

    private makeFlows(): void {
        this.flowDiagram.flows.forEach((flow) => {
            const arrowHeadSize = flow.style.arrowHeadSize || 9;
            const svg = (
                <svg width={this.sceneSize.width} height={this.sceneSize.height}>
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
                        <marker
                            id={`arrow-${flow.id}-hover`}
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
                                fill={this.config.highlightColor}
                            />
                        </marker>
                    </defs>
                </svg>
            );
            this.sceneItems.push(
                <SceneItem
                    key={`${flow.id}-defs`}
                    id={`${flow.id}-defs`}
                    type={SceneItemType.Definition}
                    size={{ width: this.sceneSize.width, height: this.sceneSize.height }}
                    position={{ x: 0, y: 0 }}
                    zIndex={0}
                    children={svg}
                    clickable={false}
                />
            );
        });
    }

    private makeEdges(graph: dagre.graphlib.Graph): void {
        let edgeIndex = 0;

        this.flowNodeEdgeIndicesMap = this.flowDiagram.nodes.map((node) => ({
            id: node.id,
            edgeIndices: [],
        }));

        this.flowDiagram.flows.forEach((flow) => {
            this.flowNodeEdgeIndicesMap.push({ id: `flow-${flow.id}`, edgeIndices: [] });
        });

        const adjustedPoints: AdjustedPoint[] = [];

        graph.edges().forEach((edge) => {
            const flow = this.flowDiagram.flows.find((flow) => flow.id === edge.name);
            if (flow) {
                const sourceNodes: { node: string; position: Point }[] = graph
                    .edges()
                    .filter((el) => el.w === edge.w)
                    .map((el) => ({ node: el.v, position: graph.edge(el).points[0] }));
                sourceNodes.sort(this.sortNodesByYCoordinate);

                const targetNodes: { node: string; position: Point }[] = graph
                    .edges()
                    .filter((el) => el.v === edge.v)
                    .map((el) => ({ node: el.w, position: graph.edge(el).points[graph.edge(el).points.length - 1] }));
                targetNodes.sort(this.sortNodesByYCoordinate);

                const strokeWidth = flow.style.strokeWidth || this.config.defaultEdgeStrokeWidth;
                const arrowWidth = flow.style.arrowHeadSize || this.config.defaultEdgeArrowSize;
                const strokeColor = flow.style.strokeColor || this.config.defaultEdgeStrokeColor;
                const strokeStyle = flow.style.strokeStyle || this.config.defaultEdgeStrokeStyle;

                const inputPoint = this.additionalFlowNodes.includes(edge.w)
                    ? graph.edge(edge).points[graph.edge(edge).points.length - 1]
                    : {
                          x: graph.node(edge.w).x - graph.node(edge.w).width / 2,
                          y:
                              graph.node(edge.w).y -
                              graph.node(edge.w).height / 2 +
                              (graph.node(edge.w).height / (sourceNodes.length + 1)) *
                                  (sourceNodes.findIndex((el) => el.node === edge.v) + 1),
                      };
                const outputPoint = this.additionalFlowNodes.includes(edge.v)
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
                if (!this.additionalFlowNodes.includes(edge.v) && this.additionalFlowNodes.includes(edge.w)) {
                    const delta = this.config.horizontalSpacing / targetNodes.length;
                    const xShift =
                        delta *
                        Math.abs(
                            targetNodes.findIndex((el) => el.node === edge.w) - Math.floor(targetNodes.length / 2)
                        );
                    points.push(outputPoint);
                    points.push({
                        x: graph.edge(edge).points[graph.edge(edge).points.length - 1].x - xShift,
                        y: outputPoint.y,
                    });
                    points.push({
                        x: graph.edge(edge).points[graph.edge(edge).points.length - 1].x - xShift,
                        y: graph.edge(edge).points[graph.edge(edge).points.length - 1].y,
                    });
                    adjustedPoints.push({
                        startNode: edge.w,
                        position: {
                            x: graph.edge(edge).points[graph.edge(edge).points.length - 1].x - xShift,
                            y: graph.edge(edge).points[graph.edge(edge).points.length - 1].y,
                        },
                    });
                    (
                        this.flowNodeEdgeIndicesMap.find((el) => el.id === edge.v) as FlowNodeEdgeIndicesMapItem
                    ).edgeIndices.push(edgeIndex);
                    this.additionalFlowNodesMap.forEach((el) => {
                        if (el.edgeId === edge.w) {
                            el.targetNodes.forEach((node) =>
                                (
                                    this.flowNodeEdgeIndicesMap.find(
                                        (entry) => entry.id === node
                                    ) as FlowNodeEdgeIndicesMapItem
                                ).edgeIndices.push(edgeIndex)
                            );
                        }
                    });
                } else if (this.additionalFlowNodes.includes(edge.v) && this.additionalFlowNodes.includes(edge.w)) {
                    points.push(
                        adjustedPoints.some((el) => el.startNode === edge.v)
                            ? (adjustedPoints.find((el) => el.startNode === edge.v) as AdjustedPoint).position
                            : graph.edge(edge).points[0]
                    );
                    points.push(graph.edge(edge).points[graph.edge(edge).points.length - 1]);
                    this.additionalFlowNodesMap.forEach((el) => {
                        if (el.edgeId === edge.w || el.edgeId === edge.v) {
                            el.targetNodes.forEach((node) =>
                                (
                                    this.flowNodeEdgeIndicesMap.find(
                                        (entry) => entry.id === node
                                    ) as FlowNodeEdgeIndicesMapItem
                                ).edgeIndices.push(edgeIndex)
                            );
                            el.sourceNodes.forEach((node) =>
                                (
                                    this.flowNodeEdgeIndicesMap.find(
                                        (entry) => entry.id === node
                                    ) as FlowNodeEdgeIndicesMapItem
                                ).edgeIndices.push(edgeIndex)
                            );
                        }
                    });
                } else if (this.additionalFlowNodes.includes(edge.v) && !this.additionalFlowNodes.includes(edge.w)) {
                    const delta = this.config.horizontalSpacing / sourceNodes.length;
                    const xShift =
                        delta *
                        Math.abs(
                            sourceNodes.findIndex((el) => el.node === edge.v) - Math.floor(sourceNodes.length / 2)
                        );
                    points.push(graph.edge(edge).points[0]);
                    points.push({
                        x: graph.edge(edge).points[0].x + xShift,
                        y: graph.edge(edge).points[0].y,
                    });
                    points.push({
                        x: graph.edge(edge).points[0].x + xShift,
                        y: inputPoint.y,
                    });
                    points.push(inputPoint);
                    (
                        this.flowNodeEdgeIndicesMap.find((el) => el.id === edge.w) as FlowNodeEdgeIndicesMapItem
                    ).edgeIndices.push(edgeIndex);
                    this.additionalFlowNodesMap.forEach((el) => {
                        if (el.edgeId === edge.v) {
                            el.sourceNodes.forEach((node) =>
                                (
                                    this.flowNodeEdgeIndicesMap.find(
                                        (entry) => entry.id === node
                                    ) as FlowNodeEdgeIndicesMapItem
                                ).edgeIndices.push(edgeIndex)
                            );
                        }
                    });
                }

                const width =
                    Math.abs(Math.max(...points.map((p) => p.x)) - Math.min(...points.map((p) => p.x))) +
                    2 * arrowWidth;
                const height =
                    Math.abs(Math.max(...points.map((p) => p.y)) - Math.min(...points.map((p) => p.y))) +
                    2 * arrowWidth;
                const left = Math.min(...points.map((point) => point.x)) - arrowWidth;
                const top = Math.min(...points.map((point) => point.y)) - arrowWidth;

                let svg = (
                    <svg width={width} height={height} style={{ marginLeft: -width / 2, marginTop: -height / 2 }}>
                        <polyline
                            points={points.map((p) => `${p.x - left},${p.y - top}`).join(" ")}
                            fill="none"
                            stroke={strokeColor}
                            strokeWidth={strokeWidth}
                            strokeDasharray={strokeStyle}
                            markerEnd={
                                this.additionalFlowNodes.includes(edge.v) && !this.additionalFlowNodes.includes(edge.w)
                                    ? `url(#arrow-${flow.id})`
                                    : undefined
                            }
                        />
                    </svg>
                );
                if (strokeStyle && strokeStyle.split(" ").length > 1) {
                    const strokes = strokeStyle.split(" ");
                    strokes.unshift("0");
                    strokes.push("0");
                    const antiDashArray = strokes.join(" ");
                    svg = (
                        <svg width={width} height={height} style={{ marginLeft: -width / 2, marginTop: -height / 2 }}>
                            <polyline
                                points={points.map((p) => `${p.x - left},${p.y - top}`).join(" ")}
                                fill="none"
                                stroke={this.config.backgroundColor}
                                strokeWidth={strokeWidth}
                                strokeDasharray={antiDashArray}
                            />
                            <polyline
                                points={points.map((p) => `${p.x - left},${p.y - top}`).join(" ")}
                                fill="none"
                                stroke={strokeColor}
                                strokeWidth={strokeWidth}
                                strokeDasharray={strokeStyle}
                                markerEnd={
                                    this.additionalFlowNodes.includes(edge.v) &&
                                    !this.additionalFlowNodes.includes(edge.w)
                                        ? `url(#arrow-${flow.id})`
                                        : undefined
                                }
                            />
                        </svg>
                    );
                }
                this.sceneItems.push(
                    <SceneItem
                        key={`${flow.id}:${edge.v}-${edge.w}-edge`}
                        id={`edge-${edgeIndex}`}
                        type={SceneItemType.Flow}
                        size={{ width: width, height: height }}
                        position={{ x: left + width / 2, y: top + height / 2 }}
                        zIndex={2}
                        children={svg}
                        clickable={false}
                    />
                );

                (
                    this.flowNodeEdgeIndicesMap.find((el) => el.id === `flow-${flow.id}`) as FlowNodeEdgeIndicesMapItem
                ).edgeIndices.push(edgeIndex);
                edgeIndex++;

                if (this.additionalFlowNodes.includes(edge.v) && this.additionalFlowNodes.includes(edge.w)) {
                    const label = (
                        <EdgeLabel
                            label={flow.label}
                            size={{ width: graph.edge(edge)["width"], height: graph.edge(edge)["height"] }}
                        />
                    );
                    const node1 = graph.node(edge.v);
                    const node2 = graph.node(edge.w);
                    this.sceneItems.push(
                        <SceneItem
                            key={`${flow.id}:${edge.v}-${edge.w}-label`}
                            id={`flow-${flow.id}`}
                            type={SceneItemType.Label}
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
            } else {
                DebugConsole.error(`Could not find flow with id '${edge.name}' - skipping.`);
            }
        });
    }

    private makeSceneSize(graph: dagre.graphlib.Graph): void {
        this.sceneSize = {
            width: graph.graph().width ? (graph.graph().width as number) : 0,
            height: graph.graph().height ? (graph.graph().height as number) : 0,
        };
    }

    public makeDiagram(): void {
        const graph = this.makeGraph();

        this.makeSceneSize(graph);
        this.makeNodes(graph);
        this.makeFlows();
        this.makeEdges(graph);
    }

    public diagram(): Diagram {
        if (this.sceneItems.length === 0) {
            this.makeDiagram();
        }
        return {
            sceneItems: this.sceneItems,
            sceneSize: this.sceneSize,
            flowNodeEdgeMap: this.flowNodeEdgeIndicesMap,
        };
    }
}
