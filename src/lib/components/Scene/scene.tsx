import React from "react";

import { Point } from "../../types/point";
import { Dimensions } from "../../types/dimensions";
import { DiagramNode, DiagramArrow } from "../../types/diagram";

type ScenePropsType = {
    centerPoint?: Point;
    dimensions?: Dimensions;
    nodes: DiagramNode[];
    arrows?: DiagramArrow[];
};

export const Scene: React.FC<ScenePropsType> = (props: ScenePropsType): JSX.Element => {
    return <div className="WorldMap">
        {props.nodes.map(node => (
            <div style={{
                position: "absolute",
                left: node.centerPosition.x,
                top: node.centerPosition.y,
                width: node.dimensions.width,
                height: node.dimensions.height,
                display: "block"
            }}>{node.node}</div>
        ))}
    </div>;
};
