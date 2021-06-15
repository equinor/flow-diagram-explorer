import React from "react";

import { Point } from "../types/point";

export const useMousePosition = (ref?: React.RefObject<HTMLElement>): Point => {
    const [position, setPosition] = React.useState<Point>({ x: 0, y: 0 });

    React.useEffect(() => {
        const handleMouseMoveEvent = (e: MouseEvent) => {
            const left = ref && ref.current ? ref.current.getBoundingClientRect().left : 0;
            const top = ref && ref.current ? ref.current.getBoundingClientRect().top : 0;
            setPosition({
                x: e.pageX - left,
                y: e.pageY - top,
            });
        };
        if (ref && ref.current) {
            ref.current.addEventListener("mousemove", handleMouseMoveEvent);
        } else {
            window.addEventListener("mousemove", handleMouseMoveEvent);
        }

        return () => {
            if (ref && ref.current) {
                ref.current.removeEventListener("mousemove", handleMouseMoveEvent);
            } else {
                window.removeEventListener("mousemove", handleMouseMoveEvent);
            }
        };
    }, [ref]);

    return position;
};
