import React from "react";

import { Point } from "../../types/point";
import { Size } from "../../types/dimensions";
import "./scene-item.css";

export type SceneItemPropsType = {
    id: string;
    size: Size;
    position: Point;
    zIndex: number;
    onMouseEnter?: (id: string, flows: string[]) => void;
    onMouseLeave?: (id: string) => void;
    onClick?: (id: string) => void;
    children?: React.ReactNode;
    viewCenterPoint?: Point;
    viewSize?: Size;
    clickable: boolean;
    hoverable?: boolean;
    connectedFlows?: string[];
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

export const SceneItem: React.FC<SceneItemPropsType> = (props: SceneItemPropsType): JSX.Element => {
    const { id, position, size, zIndex, onClick, viewCenterPoint, viewSize, clickable, onMouseEnter, onMouseLeave } = props;
    const connectedFlows = props.connectedFlows || [];
    const hoverable = props.hoverable || false;
    if ((viewCenterPoint && viewSize && isPartlyContained(viewCenterPoint, viewSize, position, size)) || (!viewCenterPoint || !viewSize)) {
        return (
            <div
                data-id={id}
                className="SceneItem"
                style={{
                    left: position.x,
                    top: position.y,
                    zIndex: zIndex,
                    cursor: onClick && clickable ? "pointer" : "default"
                }}
                onClick={onClick && clickable ? () => onClick(id) : undefined}
                onMouseEnter={onMouseEnter && hoverable ? () => onMouseEnter(id, connectedFlows) : undefined}
                onMouseLeave={onMouseLeave && hoverable ? () => onMouseLeave(id) : undefined}
            >
                {props.children}
            </div>);
    }
    else {
        return <></>;
    }
};
