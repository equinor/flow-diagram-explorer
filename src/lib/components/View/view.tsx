import React from "react";

import "./view.css";
import { useContainerDimensions } from "../../hooks/useContainerDimensions";

import { Point } from "../../types/point";
import { usePan } from "../../hooks/usePan";
import { Size } from "../../types/dimensions";
import { useMousePosition } from "../../hooks/useMousePosition";
import { usePrevious } from "../../hooks/usePrevious";
import { ORIGIN, pointDifference, pointScale, pointSum } from "../../utils/geometry";

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
    margin,
    scale,
    id,
}) => {
    const viewRef = React.useRef<HTMLDivElement>(null);
    const paneRef = React.useRef<HTMLDivElement>(null);
    const [centerPoint, setCenterPoint] = React.useState(initialCenterPoint);
    const [buffer, setBuffer] = React.useState<Point>({ x: 0, y: 0 });
    const viewSize = useContainerDimensions(viewRef);
    const offset = usePan(paneRef);
    const mousePosition = useMousePosition(paneRef);

    const previousOffset = usePrevious<Point>(offset) || ORIGIN;
    const previousScale = usePrevious<number>(scale) || 1;

    const delta = pointDifference(offset, previousOffset);

    const adjustedOffset = React.useRef<Point>(pointDifference(pointSum(offset, delta), buffer));

    React.useLayoutEffect(() => {
        if (previousScale !== scale) {
            const previousMousePosition = pointScale(mousePosition, previousScale);
            const newMousePosition = pointScale(mousePosition, scale);
            const mousePositionOffset = pointDifference(previousMousePosition, newMousePosition);
            setBuffer((buffer) => pointSum(buffer, mousePositionOffset));
        }
    }, [scale, previousScale, mousePosition]);

    if (previousScale === scale) {
        adjustedOffset.current = pointSum(adjustedOffset.current, pointScale(delta, 2 * scale));
    } else {
        const previousMousePosition = pointScale(mousePosition, previousScale);
        const newMousePosition = pointScale(mousePosition, scale);
        const mousePositionOffset = pointDifference(previousMousePosition, newMousePosition);
        adjustedOffset.current = pointSum(adjustedOffset.current, mousePositionOffset);
    }

    let transformOrigin = "0 0";

    if (viewSize.width >= boundaryBox.width * scale && viewSize.height >= boundaryBox.height * scale) {
        adjustedOffset.current = {
            x: -(boundaryBox.width - boundaryBox.width * scale) / 2,
            y: -(boundaryBox.height - boundaryBox.height * scale) / 2,
        };
    }

    React.useLayoutEffect(() => {
        setBuffer({
            x: (viewSize.width - boundaryBox.width * scale) / 2,
            y: (viewSize.height - boundaryBox.height * scale) / 2,
        });
        adjustedOffset.current = { x: 0, y: 0 };
    }, [viewSize, setBuffer, boundaryBox]);

    React.useLayoutEffect(() => {
        setCenterPoint({ x: initialCenterPoint.x, y: initialCenterPoint.y });
    }, [initialCenterPoint]);

    return (
        <div className="View" ref={viewRef} style={{ width: width, height: height }}>
            <div
                ref={paneRef}
                style={{
                    transform: `scale(${scale}) translate(${-adjustedOffset.current.x}px, ${-adjustedOffset.current
                        .y}px)`,
                    transformOrigin: transformOrigin,
                    position: "absolute",
                    left: buffer.x,
                    top: buffer.y,
                    width: Math.max(viewSize.width, boundaryBox.width * scale),
                    height: Math.max(viewSize.height, boundaryBox.height * scale),
                }}
            >
                {React.cloneElement(Scene, {
                    centerPoint: { x: centerPoint.x, y: centerPoint.y },
                    viewSize: { width: viewSize.width, height: viewSize.height },
                })}
            </div>
        </div>
    );
};
