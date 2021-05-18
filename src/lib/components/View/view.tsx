import React from "react";

import "./view.css";
import { useContainerDimensions } from "../../hooks/useContainerDimensions";

import { Point } from "../../types/point";
import { useMouseDrag } from "../../hooks/useMouseDrag";
import { Size } from "../../types/dimensions";

type ViewPropsType = {
    initialCenterPoint: Point;
    onCenterPointChange?: (newCenterPoint: Point) => void;
    Scene: React.ReactElement;
    boundaryBox: Size;
    width: number | string;
    height: number | string;
    margin: number;
};

export const calcCenterPointWithinBoundaryBox = (centerPoint: Point, viewSize: Size, boundaryBox: Size): Point => {
    const minX = viewSize.width / 2;
    const maxX = boundaryBox.width - viewSize.width / 2;
    const minY = viewSize.height / 2;
    const maxY = boundaryBox.height - viewSize.height / 2;
    const x = Math.max(minX, Math.min(maxX, centerPoint.x));
    const y = Math.max(minY, Math.min(maxY, centerPoint.y));
    return { x: x, y: y };
};

export const View: React.FC<ViewPropsType> = ({
    initialCenterPoint,
    onCenterPointChange,
    Scene,
    boundaryBox,
    width,
    height,
    margin
}) => {
    const viewRef = React.useRef<HTMLDivElement>(null);
    const [centerPoint, setCenterPoint] = React.useState(initialCenterPoint);
    const dimensions = useContainerDimensions(viewRef);
    const { dragging, dragDistance } = useMouseDrag(viewRef);

    React.useEffect(() => {
        setCenterPoint(initialCenterPoint);
    }, [initialCenterPoint]);

    React.useEffect(() => {
        if (onCenterPointChange) {
            onCenterPointChange(
                calcCenterPointWithinBoundaryBox(
                    { x: centerPoint.x - dragDistance.x, y: centerPoint.y - dragDistance.y },
                    dimensions,
                    boundaryBox
                )
            );
        }
        if (!dragging) {
            setCenterPoint(
                calcCenterPointWithinBoundaryBox(
                    { x: centerPoint.x - dragDistance.x, y: centerPoint.y - dragDistance.y },
                    dimensions,
                    boundaryBox
                )
            );
        }
    }, [dragDistance, dragging]);

    return (
        <div className="View" ref={viewRef} style={{ width: width, height: height }}>
            {React.cloneElement(Scene, {
                centerPoint: dragging
                    ? calcCenterPointWithinBoundaryBox(
                          { x: centerPoint.x - dragDistance.x, y: centerPoint.y - dragDistance.y },
                          dimensions,
                          boundaryBox
                      )
                    : centerPoint,
                dimensions: dimensions,
                margin: margin
            })}
        </div>
    );
};
