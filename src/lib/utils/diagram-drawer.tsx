import React from "react";
import dagre from "dagre";

import { FlowDiagram, RenderFunctions, FlowStyles } from "../types/diagram";
import { DiagramConfig } from "../types/diagram";
import { Size } from "../types/size";
import { SceneItem, SceneItemPropsType, SceneItemType } from "../components/SceneItem";
import { EdgeLabel } from "../components/EdgeLabel";
import { Point } from "../types/point";
import { pointSum, pointScale } from "./geometry";

enum EdgeLayer {
    Source = 0,
    JointSplit,
    Target,
}

type FlowNodeEdgeIndicesMapItem = { id: string; edgeIndices: number[] };
type RankNodeItem = { rank: number; nodes: string[] };
type EdgePointsItem = {
    id: string;
    flow: string;
    points: Point[];
    layer: EdgeLayer;
    rank: number;
    edges: dagre.Edge[];
    sourceNodes: string[];
    targetNodes: string[];
};
type AdditionalEdgesMapItem = {
    sourceNode: string;
    targetNode: string;
    flow: string;
    edges: { v: string; w: string }[];
};

export type Diagram = {
    sceneItems: React.ReactElement<SceneItemPropsType>[];
    sceneSize: Size;
    flowNodeEdgeMap: { id: string; edgeIndices: number[] }[];
};

export class DiagramDrawer {
    private flowDiagram: FlowDiagram;
    private config: DiagramConfig;
    private renderFunctions?: RenderFunctions;
    private flowStyles?: FlowStyles;
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
    private flowNodeEdgeIndicesMap: FlowNodeEdgeIndicesMapItem[];
    private sceneItems: React.ReactElement<SceneItemPropsType>[];
    private sceneSize: Size;
    private rankNodeMap: RankNodeItem[];
    private numRanks: number;
    private edgePoints: EdgePointsItem[];
    private additionalEdgesMap: AdditionalEdgesMapItem[];

    constructor(
        flowDiagram: FlowDiagram,
        config: DiagramConfig,
        renderFunctions?: RenderFunctions,
        flowStyles?: FlowStyles
    ) {
        this.flowDiagram = flowDiagram;
        this.config = config;
        this.sceneItems = [];
        this.flowNodeEdgeIndicesMap = [];
        this.sceneSize = { width: 0, height: 0 };
        this.rankNodeMap = [];
        this.numRanks = 0;
        this.edgePoints = [];
        this.additionalEdgesMap = [];
        this.renderFunctions = renderFunctions;
        this.flowStyles = flowStyles;
    }

    private makeInitialFlowNodes(graph: dagre.graphlib.Graph): void {
        this.flowDiagram.edges.forEach((edge) => {
            graph.setEdge(
                `${edge.fromNode}`,
                `${edge.toNode}`,
                { label: edge.flow, width: 300, height: 10, labelpos: "l", labeloffset: 12 },
                edge.flow
            );
        });
    }

    private addAdditionalEdge(
        sourceNode: string,
        targetNode: string,
        flow: string,
        edge: { v: string; w: string }
    ): void {
        const item = this.additionalEdgesMap.find(
            (el) => el.sourceNode === sourceNode && el.targetNode === targetNode && el.flow === flow
        );
        if (item) {
            item.edges.push(edge);
        } else {
            this.additionalEdgesMap.push({ sourceNode: sourceNode, targetNode: targetNode, flow: flow, edges: [edge] });
        }
    }

    private makeAdditionalFlowNodes(graph: dagre.graphlib.Graph): void {
        this.makeRankNodeMap(graph);
        this.additionalEdgesMap = [];
        let edgesGoingBeyondRank: dagre.Edge[] = [];
        for (let rank = 0; rank < this.numRanks - 1; rank++) {
            const currentRankNodes = this.rankNodeMap.find((el) => el.rank === rank);
            let currentRankEdges: dagre.Edge[] = [];
            if (currentRankNodes) {
                currentRankNodes.nodes.forEach((node) => {
                    const outEdges = graph.outEdges(node);
                    if (outEdges) {
                        currentRankEdges.push(...outEdges);
                    }
                });
            }
            const nextRankNodes = this.rankNodeMap.find((el) => el.rank === rank + 1);
            if (nextRankNodes) {
                nextRankNodes.nodes.forEach((node) => {
                    currentRankEdges = currentRankEdges.filter((el) => el.w !== node);
                    edgesGoingBeyondRank
                        .filter((el) => el.w === node)
                        .forEach((edge) => {
                            graph.setEdge(
                                `${edge.w}-rank-${rank - 1}`,
                                node,
                                { label: edge.name, width: 300, height: 10, labelpos: "l", labeloffset: 12 },
                                edge.name
                            );
                            this.addAdditionalEdge(edge.v, edge.w, edge.name || "", {
                                v: `${edge.w}-rank-${rank - 1}`,
                                w: edge.w,
                            });
                        });
                    edgesGoingBeyondRank = edgesGoingBeyondRank.filter((el) => el.w !== node);
                });
            }

            currentRankEdges.forEach((edge) => {
                graph.setNode(`${edge.w}-rank-${rank}`, { label: "", width: 0, height: 100 });
                graph.setEdge(
                    `${edge.v}`,
                    `${edge.w}-rank-${rank}`,
                    { label: edge.name, width: 300, height: 10, labelpos: "l", labeloffset: 12 },
                    edge.name
                );
                this.addAdditionalEdge(edge.v, edge.w, edge.name || "", { v: edge.v, w: `${edge.w}-rank-${rank}` });
            });

            edgesGoingBeyondRank.forEach((edge) => {
                graph.setNode(`${edge.w}-rank-${rank}`, { label: "", width: 0, height: 100 });
                graph.setEdge(
                    `${edge.w}-rank-${rank - 1}`,
                    `${edge.w}-rank-${rank}`,
                    { label: edge.name, width: 300, height: 10, labelpos: "l", labeloffset: 12 },
                    edge.name
                );
                this.addAdditionalEdge(edge.v, edge.w, edge.name || "", {
                    v: `${edge.w}-rank-${rank - 1}`,
                    w: `${edge.w}-rank-${rank}`,
                });
            });

            edgesGoingBeyondRank.push(...currentRankEdges);
        }
    }

    private makeGraph(): dagre.graphlib.Graph {
        const graph = new dagre.graphlib.Graph({ multigraph: true });
        graph.setGraph({ rankdir: "LR", ranksep: this.config.horizontalSpacing, nodesep: this.config.verticalSpacing });

        this.flowDiagram.nodes.forEach((node) => {
            const nodeMeta =
                node.type && this.renderFunctions && node.type in this.renderFunctions
                    ? this.renderFunctions[node.type](node)
                    : this.config.defaultRenderFunction(node);
            graph.setNode(node.id, { label: node.title, width: nodeMeta.width, height: nodeMeta.height });
        });

        this.makeInitialFlowNodes(graph);

        dagre.layout(graph, {
            rankdir: "LR",
        });

        this.makeAdditionalFlowNodes(graph);

        dagre.layout(graph, {
            rankdir: "LR",
        });

        return graph;
    }

    private makeNodes(graph: dagre.graphlib.Graph): void {
        graph.nodes().forEach((v) => {
            let renderResults = undefined;
            const node = this.flowDiagram.nodes.find((node) => node.id === v);
            if (node) {
                if (node.type && this.renderFunctions && node.type in this.renderFunctions) {
                    renderResults = this.renderFunctions[node.type](node);
                } else {
                    renderResults = this.config.defaultRenderFunction(node);
                }
            } else {
                renderResults = this.renderJointNode();
            }
            this.sceneItems.push(
                <SceneItem
                    key={v}
                    id={v}
                    type={SceneItemType.Node}
                    size={{ width: renderResults.width, height: renderResults.height }}
                    position={{ x: graph.node(v).x, y: graph.node(v).y }}
                    zIndex={8}
                    children={renderResults.html}
                    clickable={true}
                    hoverable={true}
                />
            );
        });
    }

    private makeRankNodeMap(graph: dagre.graphlib.Graph): void {
        this.rankNodeMap.length = 0;
        const sortedNodes = graph.nodes().sort((a: string, b: string) => graph.node(a).x - graph.node(b).x);
        const positionRankMap: { x: number; rank: number }[] = [];
        let rank = 0;
        sortedNodes.forEach((node) => {
            const positionRank = positionRankMap.find((el) => el.x === graph.node(node).x);
            if (!positionRank) {
                positionRankMap.push({ x: graph.node(node).x, rank: rank });
                this.rankNodeMap.push({ rank: rank, nodes: [node] });
                this.numRanks = rank + 1;
                rank++;
            } else {
                const rankNodeMapItem = this.rankNodeMap.find((el) => el.rank === positionRank.rank);
                if (rankNodeMapItem) {
                    rankNodeMapItem.nodes.push(node);
                }
            }
        });
    }

    private makeEdgeId(from: string, to: string, flow: string, layer: EdgeLayer): string {
        const layerStringMap = new Map<number, string>([
            [EdgeLayer.Source, "Source"],
            [EdgeLayer.JointSplit, "JointSplit"],
            [EdgeLayer.Target, "Target"],
        ]);
        return `${flow}:${from}-${to}:${layerStringMap.get(layer)}`;
    }

    private makeFlowEdges(edges: dagre.Edge[] | undefined, flow: string): dagre.Edge[] | undefined {
        return (
            edges &&
            edges.reduce((reducedEdges: dagre.Edge[], edge: dagre.Edge) => {
                if (edge.name === flow) {
                    reducedEdges.push(edge);
                }
                return reducedEdges;
            }, [])
        );
    }

    private makeUniqueFlowEdges(edges: dagre.Edge[] | undefined): dagre.Edge[] | undefined {
        return (
            edges &&
            edges.reduce((reducedEdges: dagre.Edge[], edge: dagre.Edge) => {
                if (!reducedEdges.find((el) => el.name === edge.name)) {
                    reducedEdges.push(edge);
                }
                return reducedEdges;
            }, [])
        );
    }

    private makeEdgePoints(graph: dagre.graphlib.Graph): void {
        this.makeRankNodeMap(graph);
        for (let rank = 0; rank < this.numRanks - 1; rank++) {
            const nodes = this.rankNodeMap.find((el) => el.rank === rank);
            if (nodes) {
                const nextRankNodes = this.rankNodeMap.find((el) => el.rank === rank + 1);
                let nextRankXPosition = 0;
                if (nextRankNodes) {
                    nextRankXPosition = Math.min(
                        ...nextRankNodes.nodes.map((el) => Math.round(graph.node(el).x - graph.node(el).width / 2))
                    );
                }

                const edges: dagre.Edge[] = [];

                // First layer: edges leaving nodes and possibly uniting flows
                const flows: string[] = [];
                let xStartPosition = 0;
                nodes.nodes.forEach((node) => {
                    const outEdges = this.makeUniqueFlowEdges(graph.outEdges(node));
                    if (outEdges) {
                        const localFlows = outEdges.reduce((reducedFlows: string[], el) => {
                            if (el.name && !reducedFlows.includes(el.name)) {
                                reducedFlows.push(el.name);
                            }
                            return reducedFlows;
                        }, []);
                        localFlows.forEach((localFlow) => {
                            if (!flows.includes(localFlow)) {
                                flows.push(localFlow);
                            }
                        });
                    }
                    xStartPosition = Math.round(
                        Math.max(xStartPosition, graph.node(node).x + graph.node(node).width / 2)
                    );
                });

                const deltaLayerPositions = Math.round((nextRankXPosition - xStartPosition) / 4);
                nodes.nodes.forEach((node) => {
                    const outEdges = this.makeUniqueFlowEdges(graph.outEdges(node));
                    if (outEdges) {
                        edges.push(...outEdges);
                        const upperRightCorner = {
                            x: Math.round(graph.node(node).x + graph.node(node).width / 2),
                            y: Math.round(graph.node(node).y - graph.node(node).height / 2),
                        };
                        outEdges.forEach((edge, index) => {
                            const startPoint = pointSum(upperRightCorner, {
                                x: 0,
                                y: Math.round(((index + 1) * graph.node(node).height) / (outEdges.length + 1)),
                            });
                            const flow = this.flowDiagram.flows.find((flow) => flow.id === edge.name);
                            if (flow) {
                                const flowIndex = flows.findIndex((el) => el === flow.id) || 0;

                                const endPoint = pointSum(
                                    { x: xStartPosition, y: upperRightCorner.y },
                                    {
                                        x: Math.round(((flowIndex + 1) / flows.length) * deltaLayerPositions),
                                        y: Math.round(((index + 1) * graph.node(node).height) / (outEdges.length + 1)),
                                    }
                                );

                                const id = this.makeEdgeId(edge.v, edge.w, flow.id, EdgeLayer.Source);
                                const edgePointItem = this.edgePoints.find(
                                    (el) => el.id === id && el.layer === EdgeLayer.Source
                                );
                                if (edgePointItem) {
                                    edgePointItem.points.push(startPoint);
                                    edgePointItem.points.push(endPoint);
                                } else {
                                    this.edgePoints.push({
                                        id: id,
                                        points: [startPoint, endPoint],
                                        flow: flow.id,
                                        layer: EdgeLayer.Source,
                                        rank: rank,
                                        edges: this.makeFlowEdges(graph.outEdges(node), flow.id) || [],
                                        sourceNodes: [node],
                                        targetNodes: [],
                                    });
                                }
                            }
                        });
                    }
                });

                const sourceJointPoints: EdgePointsItem[] = [];
                const targetJointPoints: EdgePointsItem[] = [];

                // First layer: joining flows
                flows.forEach((flow) => {
                    const otherFlowEdgePoints = this.edgePoints.reduce(
                        (reduced: EdgePointsItem[], el: EdgePointsItem) => {
                            if (el.rank === rank && el.flow === flow && el.layer === EdgeLayer.Source) {
                                reduced.push(el);
                            }
                            return reduced;
                        },
                        []
                    );
                    const jointPoint = this.calcAveragePoint(
                        otherFlowEdgePoints.map((el) => el.points[el.points.length - 1])
                    );
                    otherFlowEdgePoints.forEach((el) => el.points.push(jointPoint));

                    const edgePoints: dagre.Edge[] = [];
                    otherFlowEdgePoints.forEach((point) => {
                        edgePoints.push(...point.edges);
                    });
                    sourceJointPoints.push({
                        flow: flow,
                        id: `joint-point-${flow}-${rank}`,
                        edges: edgePoints,
                        layer: EdgeLayer.Source,
                        points: [jointPoint],
                        rank: rank,
                        sourceNodes: [],
                        targetNodes: [],
                    });
                });

                if (nextRankNodes) {
                    // Third layer: edges arriving at nodes
                    nextRankNodes.nodes.forEach((node) => {
                        const inEdges = this.makeUniqueFlowEdges(graph.inEdges(node));
                        if (inEdges) {
                            const upperLeftCorner = {
                                x: Math.round(graph.node(node).x - graph.node(node).width / 2),
                                y: Math.round(graph.node(node).y - graph.node(node).height / 2),
                            };
                            inEdges.forEach((edge, index) => {
                                const endPoint = pointSum(upperLeftCorner, {
                                    x: 0,
                                    y: Math.round(((index + 1) * graph.node(node).height) / (inEdges.length + 1)),
                                });
                                const flow = this.flowDiagram.flows.find((flow) => flow.id === edge.name);
                                if (flow) {
                                    const flowIndex = flows.findIndex((el) => el === flow.id) || 0;

                                    const startPoint = pointSum(
                                        { x: nextRankXPosition, y: upperLeftCorner.y },
                                        {
                                            x: Math.round(-((flowIndex + 1) / flows.length) * deltaLayerPositions),
                                            y: Math.round(
                                                ((index + 1) * graph.node(node).height) / (inEdges.length + 1)
                                            ),
                                        }
                                    );

                                    const id = this.makeEdgeId(edge.v, edge.w, flow.id, EdgeLayer.Target);
                                    const edgePointItem = this.edgePoints.find(
                                        (el) => el.id === id && el.layer === EdgeLayer.Target
                                    );
                                    if (edgePointItem) {
                                        edgePointItem.points.push(startPoint);
                                        edgePointItem.points.push(endPoint);
                                    } else {
                                        this.edgePoints.push({
                                            id: id,
                                            points: [startPoint, endPoint],
                                            flow: flow.id,
                                            layer: EdgeLayer.Target,
                                            rank: rank,
                                            edges: this.makeFlowEdges(graph.inEdges(node), flow.id) || [],
                                            sourceNodes: [],
                                            targetNodes: [node],
                                        });
                                    }
                                }
                            });
                        }
                    });

                    flows.length = 0;

                    nextRankNodes.nodes.forEach((node) => {
                        const outEdges = this.makeUniqueFlowEdges(graph.inEdges(node));
                        if (outEdges) {
                            const localFlows = outEdges.reduce((reducedFlows: string[], el) => {
                                if (el.name && !reducedFlows.includes(el.name)) {
                                    reducedFlows.push(el.name);
                                }
                                return reducedFlows;
                            }, []);
                            localFlows.forEach((localFlow) => {
                                if (!flows.includes(localFlow)) {
                                    flows.push(localFlow);
                                }
                            });
                        }
                    });
                    flows.forEach((flow) => {
                        const otherFlowEdgePoints = this.edgePoints.reduce(
                            (reduced: EdgePointsItem[], el: EdgePointsItem) => {
                                if (el.rank === rank && el.flow === flow && el.layer === EdgeLayer.Target) {
                                    reduced.push(el);
                                }
                                return reduced;
                            },
                            []
                        );
                        const jointPoint = this.calcAveragePoint(otherFlowEdgePoints.map((el) => el.points[0]));
                        otherFlowEdgePoints.forEach((el) => el.points.unshift(jointPoint));

                        const edgePoints: dagre.Edge[] = [];
                        otherFlowEdgePoints.forEach((point) => {
                            edgePoints.push(...point.edges);
                        });
                        targetJointPoints.push({
                            flow: flow,
                            id: `joint-point-${flow}-${rank}`,
                            edges: edgePoints,
                            layer: EdgeLayer.Target,
                            points: [jointPoint],
                            rank: rank,
                            sourceNodes: [],
                            targetNodes: [],
                        });
                    });

                    // Connect edges
                    sourceJointPoints.forEach((edgePoint) => {
                        if (edgePoint.rank === rank && edgePoint.layer === EdgeLayer.Source) {
                            targetJointPoints.forEach((targetPoint) => {
                                if (targetPoint.rank === rank && targetPoint.flow === edgePoint.flow) {
                                    const id = this.makeEdgeId(
                                        edgePoint.id,
                                        targetPoint.id,
                                        edgePoint.flow,
                                        EdgeLayer.JointSplit
                                    );
                                    const firstPoint = edgePoint.points[edgePoint.points.length - 1];
                                    const lastPoint = targetPoint.points[0];
                                    const averagePoint = this.calcAveragePoint([firstPoint, lastPoint]);
                                    this.edgePoints.push({
                                        id: id,
                                        points: [
                                            firstPoint,
                                            { x: averagePoint.x, y: firstPoint.y },
                                            { x: averagePoint.x, y: lastPoint.y },
                                            lastPoint,
                                        ],
                                        flow: edgePoint.flow,
                                        layer: EdgeLayer.JointSplit,
                                        rank: rank,
                                        edges: edgePoint.edges,
                                        sourceNodes: [],
                                        targetNodes: [],
                                    });
                                }
                            });
                        }
                    });
                }
            }
        }
    }

    private calcAveragePoint(points: Point[]): Point {
        const averagePoint = { x: 0, y: 0 };
        points.forEach((point) => {
            averagePoint.x += point.x;
            averagePoint.y += point.y;
        });
        return pointScale(averagePoint, points.length);
    }

    private makeFlows(): void {
        this.flowDiagram.flows.forEach((flow) => {
            const flowStyle =
                this.flowStyles && flow.type && flow.type in this.flowStyles
                    ? this.flowStyles[flow.type]
                    : {
                          strokeColor: this.config.defaultEdgeStrokeColor,
                          strokeStyle: this.config.defaultEdgeStrokeStyle,
                          strokeWidth: this.config.defaultEdgeStrokeWidth,
                          arrowHeadSize: this.config.defaultEdgeArrowSize,
                      };
            const arrowHeadSize = flowStyle.arrowHeadSize || this.config.defaultEdgeArrowSize;
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
                                fill={flowStyle.strokeColor || this.config.defaultEdgeStrokeColor}
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

        this.flowNodeEdgeIndicesMap = graph.nodes().map((node) => ({
            id: node,
            edgeIndices: [],
        }));

        this.flowDiagram.flows.forEach((flow) => {
            this.flowNodeEdgeIndicesMap.push({ id: `flow-${flow.id}`, edgeIndices: [] });
        });

        this.edgePoints.forEach((edge) => {
            const flow = this.flowDiagram.flows.find((flow) => flow.id === edge.flow);
            if (flow) {
                const flowStyle =
                    this.flowStyles && flow.type && flow.type in this.flowStyles
                        ? this.flowStyles[flow.type]
                        : {
                              strokeColor: this.config.defaultEdgeStrokeColor,
                              strokeStyle: this.config.defaultEdgeStrokeStyle,
                              strokeWidth: this.config.defaultEdgeStrokeWidth,
                              arrowHeadSize: this.config.defaultEdgeArrowSize,
                          };

                const strokeWidth = flowStyle.strokeWidth || this.config.defaultEdgeStrokeWidth;
                const strokeColor = flowStyle.strokeColor || this.config.defaultEdgeStrokeColor;
                const strokeStyle = flowStyle.strokeStyle || this.config.defaultEdgeStrokeStyle;
                const arrowHeadSize = flowStyle.arrowHeadSize || this.config.defaultEdgeArrowSize;

                const points = edge.points;
                let width = Math.max(...points.map((p) => p.x)) - Math.min(...points.map((p) => p.x));
                let height = Math.max(...points.map((p) => p.y)) - Math.min(...points.map((p) => p.y));
                let left = Math.min(...points.map((point) => point.x));
                let top = Math.min(...points.map((point) => point.y));
                if (edge.layer === EdgeLayer.Target) {
                    width += 2 * Math.max(arrowHeadSize, strokeWidth / 2);
                    left -= Math.max(arrowHeadSize, strokeWidth / 2);
                    height += 2 * Math.max(arrowHeadSize, strokeWidth / 2);
                    top -= Math.max(arrowHeadSize, strokeWidth / 2);
                } else {
                    width += strokeWidth;
                    left -= strokeWidth / 2;
                    height += strokeWidth;
                    top -= strokeWidth / 2;
                }

                let svg = (
                    <svg
                        width={Math.floor(width)}
                        height={Math.floor(height)}
                        style={{ position: "absolute", left: -Math.floor(width / 2), top: -Math.floor(height / 2) }}
                    >
                        <polyline
                            points={points.map((p) => `${Math.floor(p.x - left)},${Math.floor(p.y - top)}`).join(" ")}
                            fill="none"
                            stroke={strokeColor}
                            strokeWidth={strokeWidth}
                            strokeDasharray={strokeStyle}
                            markerEnd={
                                edge.layer === EdgeLayer.Target && !edge.id.includes("-rank-")
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
                        <svg
                            width={Math.floor(width)}
                            height={Math.floor(height)}
                            style={{ position: "absolute", left: -Math.floor(width / 2), top: -Math.floor(height / 2) }}
                        >
                            <polyline
                                points={points
                                    .map((p, index) => {
                                        if (edge.layer === EdgeLayer.JointSplit && index === points.length - 1) {
                                            return `${Math.floor(p.x - left - arrowHeadSize)},${Math.floor(p.y - top)}`;
                                        } else {
                                            return `${Math.floor(p.x - left)},${Math.floor(p.y - top)}`;
                                        }
                                    })
                                    .join(" ")}
                                fill="none"
                                stroke={this.config.backgroundColor}
                                strokeWidth={strokeWidth}
                                strokeDasharray={antiDashArray}
                            />
                            <polyline
                                points={points
                                    .map((p) => `${Math.floor(p.x - left)},${Math.floor(p.y - top)}`)
                                    .join(" ")}
                                fill="none"
                                stroke={strokeColor}
                                strokeWidth={strokeWidth}
                                strokeDasharray={strokeStyle}
                                markerEnd={
                                    edge.layer === EdgeLayer.Target && !edge.id.includes("-rank-")
                                        ? `url(#arrow-${flow.id})`
                                        : undefined
                                }
                            />
                        </svg>
                    );
                }
                this.sceneItems.push(
                    <SceneItem
                        key={`${edge.id}-edge`}
                        id={`edge-${edgeIndex}`}
                        type={SceneItemType.Flow}
                        size={{ width: width, height: height }}
                        position={{ x: Math.floor(left + width / 2), y: Math.floor(top + height / 2) }}
                        zIndex={2}
                        children={svg}
                        clickable={false}
                    />
                );

                if (edge.edges) {
                    edge.edges.forEach((item) => {
                        (
                            this.flowNodeEdgeIndicesMap.find((el) => el.id === item.v) as FlowNodeEdgeIndicesMapItem
                        ).edgeIndices.push(edgeIndex);

                        (
                            this.flowNodeEdgeIndicesMap.find((el) => el.id === item.w) as FlowNodeEdgeIndicesMapItem
                        ).edgeIndices.push(edgeIndex);

                        this.additionalEdgesMap.forEach((el) => {
                            if (el.flow === flow.id && el.edges.find((e) => e["v"] === item.v && e["w"] === item.w)) {
                                (
                                    this.flowNodeEdgeIndicesMap.find(
                                        (e) => e.id === el.targetNode
                                    ) as FlowNodeEdgeIndicesMapItem
                                ).edgeIndices.push(edgeIndex);
                                (
                                    this.flowNodeEdgeIndicesMap.find(
                                        (e) => e.id === el.sourceNode
                                    ) as FlowNodeEdgeIndicesMapItem
                                ).edgeIndices.push(edgeIndex);
                            }
                        });
                    });
                }

                (
                    this.flowNodeEdgeIndicesMap.find((el) => el.id === `flow-${flow.id}`) as FlowNodeEdgeIndicesMapItem
                ).edgeIndices.push(edgeIndex);
                edgeIndex++;

                if (edge.layer === EdgeLayer.JointSplit) {
                    const label = (
                        <EdgeLabel
                            label={flow.label}
                            size={{
                                width: graph.edge(edge.edges[0])["width"],
                                height: graph.edge(edge.edges[0])["height"],
                            }}
                        />
                    );
                    const node1 = edge.points[0];
                    const node2 = edge.points[edge.points.length - 1];
                    this.sceneItems.push(
                        <SceneItem
                            key={`${edge.id}-label`}
                            id={`flow-${flow.id}`}
                            type={SceneItemType.Label}
                            size={{
                                width: Math.floor(graph.edge(edge.edges[0])["width"]),
                                height: Math.floor(graph.edge(edge.edges[0])["height"]),
                            }}
                            position={{
                                x: Math.floor(node1.x + (node2.x - node1.x) / 2),
                                y: Math.floor(node1.y + (node2.y - node1.y) / 2 - graph.edge(edge.edges[0])["height"]),
                            }}
                            zIndex={6}
                            children={label}
                            clickable={true}
                            hoverable={true}
                        />
                    );
                }
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
        this.makeEdgePoints(graph);
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
