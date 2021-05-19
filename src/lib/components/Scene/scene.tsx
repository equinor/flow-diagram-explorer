import React from "react";

import { SceneItemPropsType } from "../SceneItem";
import { Point } from "../../types/point";
import { Size } from "../../types/dimensions";

import "./scene.css";

type ScenePropsType = {
    centerPoint?: Point;
    dimensions?: Size;
    size: Size;
    margin?: number;
    onNodeClick?: (nodeId: string) => void;
    children?: React.ReactElement<SceneItemPropsType>[];
};

export const Scene: React.FC<ScenePropsType> = (props: ScenePropsType): JSX.Element => {
    const { centerPoint, dimensions, size, onNodeClick, children } = props;
    const margin = props.margin || 0;

    if (!centerPoint || !dimensions) {
        return <></>;
    }

    const left =
        dimensions.width <= size.width + 2 * margin
            ? -(centerPoint.x - dimensions.width / 2.0) + margin
            : (dimensions.width - (size.width)) / 2;
    const top =
        dimensions.height <= size.height + 2 * margin
            ? -(centerPoint.y - dimensions.height / 2.0) + margin
            : (dimensions.height - (size.height)) / 2;

    const realCenterPoint = {
        x: dimensions.width / 2.0 + (centerPoint.x - dimensions.width / 2.0) - margin,
        y: dimensions.height / 2.0 + (centerPoint.y - dimensions.height / 2.0) - margin
    };

    return (
        <div className="Scene" style={{ top: top, left: left, width: size.width, height: size.height }}>
            {children && children.map((child: React.ReactElement<SceneItemPropsType>) =>
                React.cloneElement(child, {
                    viewCenterPoint: realCenterPoint, viewSize: dimensions, onClick: onNodeClick ? (id: string) => onNodeClick(id) : undefined
                })
            )}
        </div>
    );
};
