import { MANHATTAN_LENGTH, ORIGIN, vectorLength } from "../utils/geometry";
import React from "react";

import { Point } from "../types/point";
import "./../effects/effects.css";

export const usePan = (ref: React.RefObject<HTMLElement>): Point => {
    const [panPosition, setPanPosition] = React.useState<Point>(ORIGIN);
    const referencePositionRef = React.useRef<Point>(ORIGIN);
    const panningStarted = React.useRef<boolean>(false);

    const handleMouseMove = React.useCallback(
        (e: MouseEvent) => {
            const referencePosition = referencePositionRef.current;
            const currentPosition = { x: e.pageX, y: e.pageY };
            const delta = { x: referencePosition.x - currentPosition.x, y: referencePosition.y - currentPosition.y };

            if (!panningStarted.current) {
                if (vectorLength(delta) > MANHATTAN_LENGTH) {
                    panningStarted.current = true;
                }
            } else {
                referencePositionRef.current = currentPosition;
                setPanPosition((panPosition) => ({ x: panPosition.x + delta.x, y: panPosition.y + delta.y }));
            }
        },
        [panningStarted, setPanPosition]
    );

    const handleMouseUp = React.useCallback(() => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        panningStarted.current = false;
        document.body.classList.remove("effects__unselectable");
    }, [handleMouseMove, panningStarted]);

    const handleMouseDown = React.useCallback(
        (e: MouseEvent) => {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
            referencePositionRef.current = { x: e.pageX, y: e.pageY };
            document.body.classList.add("effects__unselectable");
        },
        [handleMouseMove, handleMouseUp]
    );

    React.useEffect(() => {
        if (ref.current) {
            ref.current.addEventListener("mousedown", handleMouseDown);
        }
        return () => {
            if (ref.current) {
                ref.current.removeEventListener("mousedown", handleMouseDown);
            }
        };
    }, []);

    return panPosition;
};
