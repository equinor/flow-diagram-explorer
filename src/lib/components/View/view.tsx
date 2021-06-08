import React from "react";

import "./view.css";
import { useContainerDimensions } from "../../hooks/useContainerDimensions";

import { Point } from "../../types/point";
import { usePan } from "../../hooks/usePan";
import { Size } from "../../types/dimensions";
import { useMousePosition } from "../../hooks/useMousePosition";
import { usePrevious } from "../../hooks/usePrevious";
import { ORIGIN, pointDifference, pointMultiplyWithScalar, pointScale, pointSum } from "../../utils/geometry";

type ViewPropsType = {
    initialCenterPoint: Point;
    onCenterPointChange?: (newCenterPoint: Point) => void;
    Scene: React.ReactElement;
    boundaryBox: Size;
    width: number | string;
    height: number | string;
    margin: number;
    scale: number;
    id: string;
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
    scale,
}) => {
    const [adjustedOffset, setAdjustedOffset] = React.useState<Point>(ORIGIN);
    const viewRef = React.useRef<HTMLDivElement>(null);
    const paneRef = React.useRef<HTMLDivElement>(null);
    const viewSize = useContainerDimensions(viewRef);
    const offset = usePan(viewRef);
    const mousePosition = useMousePosition(viewRef);

    const previousOffset = usePrevious<Point>(offset) || ORIGIN;
    const previousScale = usePrevious<number>(scale) || 1;

    React.useLayoutEffect(() => {
        const delta = pointDifference(previousOffset, offset);
        if (previousScale === scale) {
            setAdjustedOffset(pointSum(adjustedOffset, delta));
        } else {
            const factor = scale / previousScale;
            const d = pointMultiplyWithScalar(pointDifference(mousePosition, adjustedOffset), factor - 1);
            setAdjustedOffset(pointDifference(adjustedOffset, d));
        }
    }, [offset, scale]);

    React.useEffect(() => {
        console.log(initialCenterPoint);
        setAdjustedOffset({
            x: viewSize.width / 2 - initialCenterPoint.x,
            y: viewSize.height / 2 - initialCenterPoint.y,
        });
    }, [initialCenterPoint, viewSize, setAdjustedOffset]);

    React.useEffect(() => {
        const centerPoint = {
            x: viewSize.width / 2 - adjustedOffset.x,
            y: viewSize.height / 2 - adjustedOffset.y,
        };
        if (onCenterPointChange) {
            onCenterPointChange(centerPoint);
        }
    }, [onCenterPointChange, scale, adjustedOffset]);

    return (
        <div className="View" ref={viewRef} style={{ width: width, height: height }}>
            <div
                style={{
                    position: "absolute",
                    left: Math.floor(adjustedOffset.x),
                    top: Math.floor(adjustedOffset.y),
                }}
            >
                <div
                    ref={paneRef}
                    style={{
                        transform: `scale(${scale})`,
                        transformOrigin: "0 0",
                        position: "absolute",
                        width: boundaryBox.width,
                        height: boundaryBox.height,
                        left: 0,
                        top: 0,
                    }}
                >
                    {React.cloneElement(Scene, {
                        centerPoint: { x: boundaryBox.width / 2, y: boundaryBox.height / 2 },
                        viewSize: { width: boundaryBox.width, height: boundaryBox.height },
                    })}
                </div>
            </div>
        </div>
    );
};
