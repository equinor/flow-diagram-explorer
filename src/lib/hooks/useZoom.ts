import React from "react";

const quad = (x: number): number => {
    return -0.2 * x * x + 3.2;
};

export const useZoom = ({
    ref,
    minScale = 0.5,
    maxScale = 3,
    delta = 0.1,
}: {
    ref: React.RefObject<HTMLElement>;
    minScale?: number;
    maxScale?: number;
    delta?: number;
}): { scale: number; resetScale: () => void; setNewScale: (newScale: number) => void } => {
    const [scale, setScale] = React.useState(1);

    const interval = React.useRef<null | ReturnType<typeof setInterval>>();

    React.useEffect(() => {
        return () => {
            if (interval.current) {
                clearInterval(interval.current);
            }
        };
    }, []);

    React.useEffect(() => {
        const handleWheelEvent = (e: WheelEvent) => {
            if (interval.current) {
                clearInterval(interval.current);
            }
            e.preventDefault();
            setScale(Math.min(maxScale, Math.max(minScale, scale - Math.sign(e.deltaY) * delta)));
        };

        const handleDblClickEvent = (e: MouseEvent) => {
            e.preventDefault();
            let i = 0;
            let newScale = scale;
            if (interval.current) {
                clearInterval(interval.current);
            }
            interval.current = setInterval(() => {
                newScale = newScale + (quad(-4 + i++) / 4) * delta;
                setScale(Math.min(maxScale, Math.max(minScale, newScale)));
                if (i > 8 && interval.current) {
                    clearInterval(interval.current);
                }
            }, 50);
        };

        if (ref.current) {
            ref.current.addEventListener("wheel", handleWheelEvent);
            ref.current.addEventListener("dblclick", handleDblClickEvent, true);
        }

        return () => {
            if (ref.current) {
                ref.current.removeEventListener("wheel", handleWheelEvent);
                ref.current.removeEventListener("dblclick", handleDblClickEvent, true);
            }
        };
    }, [ref, scale, minScale, maxScale]);

    const resetScale = React.useCallback(() => {
        setScale(1);
    }, []);

    const setNewScale = React.useCallback(
        (newScale: number) => {
            setScale(newScale);
        },
        [setScale]
    );

    return { scale: scale, resetScale: resetScale, setNewScale: setNewScale };
};
