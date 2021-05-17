import React from "react";

import { Point } from "../types/point";
import "./effects.css";

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
}

export const useMouseDrag = (): Point => {
  const [referencePosition, setReferencePosition] = React.useState<Point>({ x: 0, y: 0 });
  const [distance, setDistance] = React.useState<Point>({ x: 0, y: 0 });
  const mousePosition = useMousePosition();
  const [mousePressed, setMousePressed] = React.useState(false);

  React.useEffect(() => {
    const setFromEvent = (e: MouseEvent) => {
      if (e.button === 0) {
        setMousePressed(true);
        setReferencePosition({ x: e.clientX, y: e.clientY });
        document.body.classList.add("effects__unselectable");
      }
    };
    const unsetFromEvent = (e: MouseEvent) => {
      setMousePressed(false);
      if (calcDistance(referencePosition, { x: e.clientX, y: e.clientY }) > 13.11) {
        setDistance({ x: distance.x + e.clientX - referencePosition.x, y: distance.y + e.clientY - referencePosition.y });
      }
      document.body.classList.remove("effects__unselectable");
    }
    window.addEventListener("mousedown", setFromEvent);
    window.addEventListener("mouseup", unsetFromEvent);

    return () => {
      window.removeEventListener("mousedown", setFromEvent);
      window.removeEventListener("mouseup", unsetFromEvent);
    };
  }, [referencePosition]);

  if (mousePressed) {
    return { x: distance.x + mousePosition.x - referencePosition.x, y: distance.y + mousePosition.y - referencePosition.y }
  }
  return distance;
}
