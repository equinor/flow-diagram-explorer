import React from "react";

import { SceneItemPropsType } from "../SceneItem";
import { Point } from "../../types/point";
import { Size } from "../../types/size";

import "./scene.css";

type ScenePropsType = {
    centerPoint?: Point;
    viewSize?: Size;
    size: Size;
    onNodeClick?: (nodeId: string) => void;
    onNodeEnter: (nodeId: string) => void;
    onNodeLeave: (nodeId: string) => void;
    children?: React.ReactElement<SceneItemPropsType>[];
};

export const Scene: React.FC<ScenePropsType> = React.memo((props: ScenePropsType): JSX.Element => {
    const { centerPoint, viewSize, size, onNodeClick, onNodeEnter, onNodeLeave, children } = props;

    if (!centerPoint || !viewSize) {
        return <></>;
    }

    return (
        <div className="Scene" style={{ width: size.width, height: size.height }}>
            {children &&
                children.map((child: React.ReactElement<SceneItemPropsType>) =>
                    React.cloneElement(child, {
                        viewCenterPoint: centerPoint,
                        viewSize: viewSize,
                        onClick: onNodeClick ? (id: string) => onNodeClick(id) : undefined,
                        onMouseEnter: onNodeEnter,
                        onMouseLeave: onNodeLeave,
                    })
                )}
        </div>
    );
});
