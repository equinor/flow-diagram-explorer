import React from "react";

import { Point } from "../../types/point";
import { Size } from "../../types/dimensions";

export type SceneItemPropsType = {
    id: string;
    size: Size;
    position: Point;
    zIndex: number;
    onClick?: (id: string) => void;
    children?: React.ReactNode;
    viewCenterPoint?: Point;
    viewSize?: Size;
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
    const { id, position, size, zIndex, onClick, viewCenterPoint, viewSize } = props;
    if ((viewCenterPoint && viewSize && isPartlyContained(viewCenterPoint, viewSize, position, size)) || (!viewCenterPoint || !viewSize)) {
        return (
            <div
                style={{
                    position: "absolute",
                    left: position.x,
                    top: position.y,
                    zIndex: zIndex
                }}
                onClick={onClick ? () => onClick(id) : undefined}
            >
                {props.children}
            </div>);
    }
    else {
        return <></>;
    }
};
