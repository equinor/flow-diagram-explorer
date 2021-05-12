import React from "react";

import "./view.css";
import { useContainerDimensions } from "../../hooks/useContainerDimensions";

import { Point } from "../../types/point";

type ViewPropsType = {
    initialCenterPoint: Point;
    Scene: React.ReactElement;
    width: number;
    height: number;
};

export const View: React.FC<ViewPropsType> = ({ initialCenterPoint, Scene, width, height }) => {
    const viewRef = React.useRef<HTMLDivElement>(null);
    const [centerPoint, setCenterPoint] = React.useState({ x: initialCenterPoint.x, y: initialCenterPoint.y });
    const dimensions = useContainerDimensions(viewRef);

    React.useEffect(() => {
        setCenterPoint({ x: initialCenterPoint.x, y: initialCenterPoint.y });
    }, [initialCenterPoint]);

    return (
        <div className="View" ref={viewRef} style={{ width: width, height: height }}>
            {React.cloneElement(Scene, { centerPoint: centerPoint, dimensions: dimensions })}
        </div>
    );
};
