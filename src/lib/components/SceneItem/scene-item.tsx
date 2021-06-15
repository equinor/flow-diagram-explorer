import React from "react";

import { isPartlyContained } from "../../utils/geometry";
import { Point } from "../../types/point";
import { Size } from "../../types/size";

import "./scene-item.css";

export type SceneItemPropsType = {
    id: string;
    size: Size;
    position: Point;
    zIndex: number;
    onMouseEnter?: (id: string) => void;
    onMouseLeave?: (id: string) => void;
    onClick?: (id: string) => void;
    children?: React.ReactNode;
    viewCenterPoint?: Point;
    viewSize?: Size;
    clickable: boolean;
    hoverable?: boolean;
};

export const SceneItem: React.FC<SceneItemPropsType> = (props) => {
    const { id, position, size, zIndex, onClick, viewCenterPoint, viewSize, clickable, onMouseEnter, onMouseLeave } =
        props;
    const hoverable = props.hoverable || false;
    if (
        (viewCenterPoint && viewSize && isPartlyContained(viewCenterPoint, viewSize, position, size)) ||
        !viewCenterPoint ||
        !viewSize
    ) {
        return (
            <div
                data-id={id}
                className="SceneItem"
                style={{
                    left: position.x,
                    top: position.y,
                    zIndex: zIndex,
                    cursor: onClick && clickable ? "pointer" : "default",
                }}
                onClick={onClick && clickable ? () => onClick(id) : undefined}
                onMouseEnter={onMouseEnter && hoverable ? () => onMouseEnter(id) : undefined}
                onMouseLeave={onMouseLeave && hoverable ? () => onMouseLeave(id) : undefined}
            >
                {props.children}
            </div>
        );
    } else {
        return <></>;
    }
};
