import React from "react";

import { Point } from "../../types/point";
import { Dimensions } from "../../types/dimensions";
import { DiagramNode, DiagramArrow } from "../../types/diagram";

import "./scene.css";

type ScenePropsType = {
    centerPoint?: Point;
    dimensions?: Dimensions;
    nodes?: DiagramNode[];
    arrows?: DiagramArrow[];
};

const isPartlyContained = (
    centerPoint1: Point,
    dimensions1: Dimensions,
    centerPoint2: Point,
    dimensions2: Dimensions
): boolean => {
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
    const { centerPoint, dimensions } = props;

    if (!centerPoint || !dimensions) {
        return <></>;
    }

    const left = centerPoint.x - dimensions.width / 2.0;
    const top = centerPoint.y - dimensions.height / 2.0;

    const realCenterPoint = { x: dimensions.width / 2.0 - left, y: dimensions.height / 2.0 - top };

    let count = 0;

    if (props.nodes) {
        props.nodes.forEach((node) => {
            if (isPartlyContained(realCenterPoint, dimensions, node.centerPosition, node.dimensions)) {
                count++;
            }
        });
    }
    console.log(`Drawing ${count} nodes.`)

    return (
        <div className="Scene" style={{ top: top, left: left }}>
            {props.nodes &&
                props.nodes.map((node) => {
                    if (isPartlyContained(realCenterPoint, dimensions, node.centerPosition, node.dimensions)) {
                        return (
                            <div
                                style={{
                                    position: "absolute",
                                    left: node.centerPosition.x,
                                    top: node.centerPosition.y,
                                    width: node.dimensions.width + "px",
                                    height: node.dimensions.height + "px",
                                    marginTop: -node.dimensions.height / 2 + "px",
                                    marginLeft: -node.dimensions.width / 2 + "px",
                                    textAlign: "center",
                                    verticalAlign: "middle",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: "#ccc",
                                    border: "1px black solid",
                                    zIndex: 0
                                }}
                            >
                                {node.node}
                            </div>
                        );
                    } else {
                        return null;
                    }
                })}
            <svg width="10000" height="10000" style={{ position: "absolute", left: 0, top: 0 }}>
                <defs>
                    <marker
                        id="arrow"
                        markerWidth="16"
                        markerHeight="16"
                        refX="9"
                        refY="3"
                        orient="auto"
                        markerUnits="strokeWidth"
                        viewBox="0 0 20 20"
                    >
                        <path d="M0,0 L0,6 L9,3 z" fill="#000" />
                    </marker>
                </defs>
                {props.arrows!.map((arrow) => {
                    if (
                        isPartlyContained(
                            realCenterPoint,
                            dimensions!,
                            {
                                x: arrow.points[0].x + (arrow.points[arrow.points.length - 1].x - arrow.points[0].x) / 2,
                                y: arrow.points[0].y + (arrow.points[arrow.points.length - 1].y - arrow.points[0].y) / 2
                            },
                            {
                                width: Math.abs(arrow.points[arrow.points.length - 1].x - arrow.points[0].x),
                                height: Math.abs(arrow.points[arrow.points.length - 1].y - arrow.points[0].y)
                            }
                        )
                    ) {
                        return (
                            <polyline
                                points={arrow.points.map(p => `${p.x},${p.y}`).join(" ")}
                                fill="none"
                                stroke="#000"
                                strokeWidth={2}
                                markerEnd="url(#arrow)"
                            />
                        );
                    } else {
                        return null;
                    }
                })}
            </svg>
        </div>
    );
};
