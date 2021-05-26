import React from "react";

import { Point } from "../types/point";
import "./../effects/effects.css";

export const useMousePosition = (): Point => {
    const [position, setPosition] = React.useState<Point>({ x: 0, y: 0 });

    React.useEffect(() => {
        const setFromEvent = (e: MouseEvent) => setPosition({ x: e.clientX, y: e.clientY });
        window.addEventListener("mousemove", setFromEvent);

        return () => {
            window.removeEventListener("mousemove", setFromEvent);
        };
    }, []);

    return position;
};

const calcDistance = (point1: Point, point2: Point): number => {
    return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
};

export const useMouseDrag = (ref: React.RefObject<HTMLElement>): { dragging: boolean; dragDistance: Point } => {
    const [referencePosition, setReferencePosition] = React.useState<Point>({ x: 0, y: 0 });
    const [distance, setDistance] = React.useState<Point>({ x: 0, y: 0 });
    const mousePosition = useMousePosition();
    const [mousePressed, setMousePressed] = React.useState(false);

    React.useEffect(() => {
        const setFromEvent = (e: MouseEvent) => {
            if (e.button === 0) {
                setDistance({ x: 0, y: 0 });
                setMousePressed(true);
                setReferencePosition({ x: e.clientX, y: e.clientY });
                document.body.classList.add("effects__unselectable");
            }
        };

        const handleMouseUp = () => {
            if (mousePressed) {
                setMousePressed(false);
                document.body.classList.remove("effects__unselectable");
            }
        };

        const handleMouseClick = (e: MouseEvent) => {
            if (
                mousePressed &&
                calcDistance({ x: e.clientX, y: e.clientY }, { x: mousePosition.x, y: mousePosition.y }) > 13.11
            ) {
                e.stopPropagation();
            }
        };

        if (ref.current) {
            ref.current.addEventListener("mousedown", setFromEvent);
            window.addEventListener("mouseup", handleMouseUp);
            window.addEventListener("click", handleMouseClick, true);
        }

        return () => {
            if (ref.current) {
                ref.current.removeEventListener("mousedown", setFromEvent);
                window.removeEventListener("mouseup", handleMouseUp);
                window.removeEventListener("click", handleMouseClick, true);
            }
        };
    }, [referencePosition, ref, mousePressed]);

    React.useEffect(() => {
        if (mousePressed && calcDistance(referencePosition, { x: mousePosition.x, y: mousePosition.y }) > 13.11) {
            setDistance({ x: mousePosition.x - referencePosition.x, y: mousePosition.y - referencePosition.y });
        }
    }, [mousePosition]);

    return { dragging: mousePressed, dragDistance: distance };
};
