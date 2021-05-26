import React from "react";

export const useMouseZoom = ({
    ref,
    minScale = 0.125,
    maxScale = 4,
    delta = 0.01,
}: {
    ref: React.RefObject<HTMLElement>;
    minScale: number;
    maxScale: number;
    delta: number;
}): number => {
    const [scale, setScale] = React.useState(1);

    React.useEffect(() => {
        const setFromEvent = (e: WheelEvent) => {
            e.preventDefault();
            setScale(Math.min(maxScale, Math.max(minScale, scale - e.deltaY * delta)));
        };

        if (ref.current) {
            ref.current.addEventListener("wheel", setFromEvent);
        }

        return () => {
            if (ref.current) {
                ref.current.removeEventListener("wheel", setFromEvent);
            }
        };
    }, [ref, scale]);

    return scale;
};
