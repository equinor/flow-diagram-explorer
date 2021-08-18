import React from "react";

import "./view.css";
import { useContainerDimensions } from "../../hooks/useContainerDimensions";

import { Point } from "../../types/point";
import { usePan } from "../../hooks/usePan";
import { Size } from "../../types/size";
import { useMousePosition } from "../../hooks/useMousePosition";
import { usePrevious } from "../../hooks/usePrevious";
import { ORIGIN, pointDifference, pointMultiplyWithScalar, pointSum } from "../../utils/geometry";

type ViewPropsType = {
    initialCenterPoint: Point;
    onCenterPointChange?: (newCenterPoint: Point) => void;
    Scene: React.ReactElement;
    boundaryBox: Size;
    width: number | string;
    height: number | string;
    scale: number;
    backgroundColor: string;
};

export const View: React.FC<ViewPropsType> = ({
    initialCenterPoint,
    onCenterPointChange,
    Scene,
    boundaryBox,
    width,
    height,
    scale,
    backgroundColor,
}) => {
    const [adjustedOffset, setAdjustedOffset] = React.useState<Point>(ORIGIN);
    const [rendered, setRendered] = React.useState<boolean>(false);
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
        setAdjustedOffset({
            x: viewSize.width / 2 - initialCenterPoint.x * scale,
            y: viewSize.height / 2 - initialCenterPoint.y * scale,
        });
        setRendered(true);
    }, [initialCenterPoint, viewSize, setAdjustedOffset]);

    React.useEffect(() => {
        const centerPoint = {
            x: (viewSize.width / 2 - adjustedOffset.x) / scale,
            y: (viewSize.height / 2 - adjustedOffset.y) / scale,
        };
        if (onCenterPointChange) {
            onCenterPointChange(centerPoint);
        }
    }, [onCenterPointChange, scale, adjustedOffset]);

    return (
        <div className="View" ref={viewRef} style={{ width: width, height: height, backgroundColor: backgroundColor }}>
            <div
                style={{
                    left: Math.floor(adjustedOffset.x),
                    top: Math.floor(adjustedOffset.y),
                }}
            >
                <div
                    ref={paneRef}
                    style={{
                        transform: `scale(${scale})`,
                        width: boundaryBox.width,
                        height: boundaryBox.height,
                    }}
                >
                    {rendered ? (
                        React.cloneElement(Scene, {
                            centerPoint: { x: boundaryBox.width / 2, y: boundaryBox.height / 2 },
                            viewSize: { width: boundaryBox.width, height: boundaryBox.height },
                        })
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
    );
};
