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

    React.useEffect(() => {
        const handleWheelEvent = (e: WheelEvent) => {
            e.preventDefault();
            setScale(Math.min(maxScale, Math.max(minScale, scale - Math.sign(e.deltaY) * delta)));
        };

        const handleDblClickEvent = (e: MouseEvent) => {
            e.preventDefault();
            let i = 0;
            let newScale = scale;
            const timer = setInterval(() => {
                newScale = newScale + (quad(-4 + i++) / 4) * delta;
                setScale(Math.min(maxScale, Math.max(minScale, newScale)));
                if (i > 8) {
                    clearInterval(timer);
                }
            }, 50);
        };

        if (ref.current) {
            ref.current.addEventListener("wheel", handleWheelEvent);
            ref.current.addEventListener("dblclick", handleDblClickEvent);
        }

        return () => {
            if (ref.current) {
                ref.current.removeEventListener("wheel", handleWheelEvent);
                ref.current.removeEventListener("dblclick", handleDblClickEvent);
            }
        };
    }, [ref, scale]);

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
