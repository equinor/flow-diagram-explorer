import React from "react";
import clsx from "clsx";

import { Point } from "../../types/point";
import { Size } from "../../types/size";
import { Rectangle } from "../../types/rectangle";
import { usePan } from "../../hooks/usePan";
import { usePrevious } from "../../hooks/usePrevious";
import { ORIGIN, pointDifference } from "../../utils/geometry";

import "./minimap.css";
import "./../../effects/effects.css";

type MinimapPropsType = {
    initialCenterPoint: Point;
    Scene: React.ReactElement;
    viewSize: Size;
    boundaryBox: Size;
    onCenterPointChange?: (newCenterPoint: Point) => void;
    scale: number;
};

export const calcCenterPointWithinBoundaryBox = (centerPoint: Point, boundaryBox: Size): Point => {
    const minX = 0;
    const maxX = boundaryBox.width;
    const minY = 0;
    const maxY = boundaryBox.height;
    const x = Math.max(minX, Math.min(maxX, centerPoint.x));
    const y = Math.max(minY, Math.min(maxY, centerPoint.y));
    return { x: x, y: y };
};

export const calcViewFrameWithinBoundaries = (
    centerPoint: Point,
    viewSize: Size,
    boundaryBox: Size,
    scale: number
): Rectangle => {
    const unboundLeft = centerPoint.x - viewSize.width / 2 / scale;
    const unboundTop = centerPoint.y - viewSize.height / 2 / scale;
    const unboundRight = centerPoint.x + viewSize.width / 2 / scale;
    const unboundBottom = centerPoint.y + viewSize.height / 2 / scale;

    const left = Math.min(Math.max(unboundLeft, 0), boundaryBox.width);
    const top = Math.min(Math.max(unboundTop, 0), boundaryBox.height);

    const width = Math.min(viewSize.width / scale, unboundRight, boundaryBox.width - unboundLeft, boundaryBox.width);
    const height = Math.min(
        viewSize.height / scale,
        unboundBottom,
        boundaryBox.height - unboundTop,
        boundaryBox.height
    );
    return { left: left, top: top, width: width, height: height };
};

export const Minimap: React.FC<MinimapPropsType> = (props) => {
    const { initialCenterPoint, Scene, viewSize, boundaryBox, onCenterPointChange, scale } = props;

    const scaling = Math.min(0.1, 150 / Math.max(boundaryBox.width, boundaryBox.height));

    const [centerPoint, setCenterPoint] = React.useState(initialCenterPoint);
    const [mouseDownPosition, setMouseDownPosition] = React.useState({ x: 0, y: 0 });

    const viewRef = React.useRef<HTMLDivElement>(null);
    const mapRef = React.useRef<HTMLDivElement>(null);
    const offset = usePan(viewRef);

    const previousOffset = usePrevious<Point>(offset) || ORIGIN;

    React.useEffect(() => {
        setCenterPoint({ x: initialCenterPoint.x, y: initialCenterPoint.y });
    }, [initialCenterPoint]);

    React.useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            setMouseDownPosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseUp = (e: MouseEvent) => {
            if (
                onCenterPointChange &&
                Math.sqrt(Math.pow(e.clientX - mouseDownPosition.x, 2) + Math.pow(e.clientY - mouseDownPosition.y, 2)) <
                    1
            ) {
                if (mapRef.current) {
                    const newCenterPoint = {
                        x:
                            (mouseDownPosition.x -
                                mapRef.current.getBoundingClientRect().left -
                                parseInt(window.getComputedStyle(mapRef.current).getPropertyValue("padding-left"))) /
                            scaling,
                        y:
                            (mouseDownPosition.y -
                                mapRef.current.getBoundingClientRect().top -
                                parseInt(window.getComputedStyle(mapRef.current).getPropertyValue("padding-top"))) /
                            scaling,
                    };
                    const adjustedCenterPoint = calcCenterPointWithinBoundaryBox(newCenterPoint, boundaryBox);
                    setCenterPoint(adjustedCenterPoint);
                    onCenterPointChange(adjustedCenterPoint);
                }
            }
        };

        if (mapRef.current) {
            mapRef.current.addEventListener("mousedown", handleMouseDown);
            window.addEventListener("mouseup", handleMouseUp);
        }
        return () => {
            if (mapRef.current) {
                mapRef.current.removeEventListener("mousedown", handleMouseDown);
                window.removeEventListener("mouseup", handleMouseUp);
            }
        };
    }, [mapRef, mouseDownPosition]);

    React.useEffect(() => {
        const delta = pointDifference(offset, previousOffset);

        const adjustedCenterPoint = {
            x: centerPoint.x - delta.x / scaling,
            y: centerPoint.y - delta.y / scaling,
        };
        setCenterPoint(adjustedCenterPoint);
        if (onCenterPointChange) {
            onCenterPointChange(adjustedCenterPoint);
        }
    }, [offset]);

    const rectangle = calcViewFrameWithinBoundaries(centerPoint, viewSize, boundaryBox, scale);

    return (
        <div
            className={clsx("Minimap", "FlowDiagramExplorer__effects__unselectable")}
            style={{ width: boundaryBox.width * scaling, height: boundaryBox.height * scaling }}
            ref={mapRef}
        >
            <div>
                <div style={{ transform: `scale(${scaling})` }}>
                    {React.cloneElement(Scene, {
                        animationsOn: false,
                        centerPoint: { x: boundaryBox.width / 2, y: boundaryBox.height / 2 },
                        viewSize: { width: boundaryBox.width, height: boundaryBox.height },
                    })}
                    <div
                        ref={viewRef}
                        className="Minimap__View"
                        style={{
                            width: rectangle.width,
                            height: rectangle.height,
                            left: rectangle.left,
                            top: rectangle.top,
                        }}
                    ></div>
                    <div
                        className="NoHoverLayer"
                        style={{
                            width: boundaryBox.width,
                            height: boundaryBox.height,
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
