import React from "react";

import { Point } from "../../types/point";
import { Size } from "../../types/dimensions";
import { DiagramNode, DiagramArrow } from "../../types/diagram";

import "./scene.css";

type ScenePropsType = {
    centerPoint?: Point;
    dimensions?: Size;
    nodes?: DiagramNode[];
    arrows?: DiagramArrow[];
    size: Size;
    margin?: number;
    onNodeClick?: (nodeId: string) => void;
};

const isPartlyContained = (centerPoint1: Point, dimensions1: Size, centerPoint2: Point, dimensions2: Size): boolean => {
    if (
        centerPoint1.x + dimensions1.width / 2 < centerPoint2.x - dimensions2.width / 2 ||
        centerPoint1.x - dimensions1.width / 2 > centerPoint2.x + dimensions2.width / 2 ||
        centerPoint1.y + dimensions1.height / 2 < centerPoint2.y - dimensions2.height / 2 ||
        centerPoint1.y - dimensions1.height / 2 > centerPoint2.y + dimensions2.height / 2
    ) {
        return false;
    }
    return true;
};

export const Scene: React.FC<ScenePropsType> = (props: ScenePropsType): JSX.Element => {
    const { centerPoint, dimensions, size, onNodeClick } = props;
    const margin = props.margin || 0;

    if (!centerPoint || !dimensions) {
        return <></>;
    }

    const left =
        dimensions.width <= size.width + 2 * margin
            ? -(centerPoint.x - dimensions.width / 2.0) + margin
            : (dimensions.width - (size.width + 2 * margin)) / 2;
    const top =
        dimensions.height <= size.height + 2 * margin
            ? -(centerPoint.y - dimensions.height / 2.0) + margin
            : (dimensions.height - (size.height + 2 * margin)) / 2;

    const realCenterPoint = {
        x: dimensions.width / 2.0 + (centerPoint.x - dimensions.width / 2.0) - margin,
        y: dimensions.height / 2.0 + (centerPoint.y - dimensions.height / 2.0) - margin
    };

    const markers: string[] = [];

    return (
        <div className="Scene" style={{ top: top, left: left, width: size.width, height: size.height }}>
            {props.nodes &&
                props.nodes.map((node) => {
                    if (isPartlyContained(realCenterPoint, dimensions, node.centerPosition, node.size)) {
                        return (
                            <div
                                key={`node-${node.id}`}
                                style={{
                                    position: "absolute",
                                    left: node.centerPosition.x,
                                    top: node.centerPosition.y,
                                    zIndex: 1
                                }}
                                onClick={onNodeClick ? () => onNodeClick(node.id) : undefined}
                            >
                                {node.html}
                            </div>
                        );
                    } else {
                        return null;
                    }
                })}
            <svg width={size.width} height={size.height} style={{ position: "absolute", left: 0, top: 0 }}>
                {props.arrows!.map((arrow, index) => {
                    if (
                        isPartlyContained(
                            realCenterPoint,
                            dimensions!,
                            {
                                x:
                                    arrow.points[0].x +
                                    (arrow.points[arrow.points.length - 1].x - arrow.points[0].x) / 2,
                                y: arrow.points[0].y + (arrow.points[arrow.points.length - 1].y - arrow.points[0].y) / 2
                            },
                            {
                                width: Math.abs(arrow.points[arrow.points.length - 1].x - arrow.points[0].x),
                                height: Math.abs(arrow.points[arrow.points.length - 1].y - arrow.points[0].y)
                            }
                        )
                    ) {
                        const test = markers.includes(arrow.flow.id);
                        if (!test) {
                            markers.push(arrow.flow.id);
                        }
                        return (
                            <>
                                {!test && (
                                    <defs>
                                        <marker
                                            id={`arrow-${arrow.flow.id}`}
                                            key={`arrow-${arrow.flow.id}`}
                                            markerWidth="16"
                                            markerHeight="16"
                                            refX="9"
                                            refY="3"
                                            orient="auto"
                                            markerUnits="strokeWidth"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M0,0 L0,6 L9,3 z" fill={arrow.flow.style.color} />
                                        </marker>
                                    </defs>
                                )}
                                <polyline
                                    key={`arrow-${index}`}
                                    points={arrow.points.map((p) => `${p.x},${p.y}`).join(" ")}
                                    fill="none"
                                    stroke={arrow.flow.style.color}
                                    strokeWidth={2}
                                    strokeDasharray={arrow.flow.style.strokeStyle}
                                    markerEnd={`url(#arrow-${arrow.flow.id})`}
                                />
                            </>
                        );
                    } else {
                        return null;
                    }
                })}
            </svg>
            {props.arrows!.map((arrow, index) => {
                if (
                    isPartlyContained(
                        realCenterPoint,
                        dimensions!,
                        {
                            x: arrow.labelPosition.x + 50,
                            y: arrow.labelPosition.y + 10
                        },
                        {
                            width: 100,
                            height: 20
                        }
                    )
                ) {
                    return (
                        <div
                            key={`label-${index}`}
                            style={{
                                position: "absolute",
                                left: arrow.labelPosition.x,
                                top: arrow.labelPosition.y,
                                zIndex: 0,
                                color: "black",
                                backgroundColor: "white",
                                padding: "8px"
                            }}
                        >
                            {arrow.label}
                        </div>
                    );
                } else {
                    return null;
                }
            })}
        </div>
    );
};
