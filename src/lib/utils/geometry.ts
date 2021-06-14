import { Point } from "lib/types/point";
import { Size } from "lib/types/size";

export const ORIGIN = Object.freeze({ x: 0, y: 0 });
export const MANHATTAN_LENGTH = 13.11;

export const vectorLength = (vector: Point): number => {
    return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
};

export const pointDistance = (point1: Point, point2: Point): number => {
    return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
};

export const pointDifference = (point1: Point, point2: Point): Point => {
    return { x: point1.x - point2.x, y: point1.y - point2.y };
};

export const pointSum = (point1: Point, point2: Point): Point => {
    return { x: point1.x + point2.x, y: point1.y + point2.y };
};

export const pointAddScalar = (point: Point, scalar: number): Point => {
    return { x: point.x + scalar, y: point.y + scalar };
};

export const pointScale = (point: Point, factor: number): Point => {
    return { x: point.x / factor, y: point.y / factor };
};

export const pointMultiplyWithScalar = (point: Point, scalar: number): Point => {
    return { x: point.x * scalar, y: point.y * scalar };
};

export const isPartlyContained = (
    centerPoint1: Point,
    dimensions1: Size,
    centerPoint2: Point,
    dimensions2: Size
): boolean => {
    if (
        centerPoint1.x + dimensions1.width / 2 < centerPoint2.x - dimensions2.width / 2 ||
        centerPoint1.x - dimensions1.width / 2 > centerPoint2.x + dimensions2.width / 2 ||
        centerPoint1.y + dimensions1.height / 2 < centerPoint2.y - dimensions2.height / 2 ||
        centerPoint1.y - dimensions1.height / 2 > centerPoint2.y + dimensions2.height / 2
    ) {
        return false;
    }
    return true;
};
