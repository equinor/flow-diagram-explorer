import React from "react";

import { Point } from "../types/point";
import "./../effects/effects.css";

export const useMousePosition = (ref: React.RefObject<HTMLElement>): Point => {
    const [position, setPosition] = React.useState<Point>({ x: 0, y: 0 });

    React.useEffect(() => {
        const handleMouseMoveEvent = (e: MouseEvent) =>
            setPosition({
                x: e.pageX - (ref.current ? ref.current?.offsetLeft : 0),
                y: e.pageY - (ref.current ? ref.current?.offsetTop : 0),
            });
        if (ref.current) {
            ref.current.addEventListener("mousemove", handleMouseMoveEvent);
        }

        return () => {
            if (ref.current) {
                ref.current.removeEventListener("mousemove", handleMouseMoveEvent);
            }
        };
    }, [ref]);

    return position;
};
