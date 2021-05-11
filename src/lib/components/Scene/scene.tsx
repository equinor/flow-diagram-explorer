import React from "react";

import { Point } from "../../types/point";
import { Dimensions } from "../../types/dimensions";

type ScenePropsType = {
    centerPoint: Point;
    dimensions: Dimensions;
    children?: React.ReactNode;
};

export const Scene: React.FC<ScenePropsType> = (props: ScenePropsType): JSX.Element => {
    return <div className="WorldMap">{props.children}</div>;
};
