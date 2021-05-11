import { Dimensions } from "./dimensions";
import { Point } from "./point";

export type DiagramConfig = {
    horizontalSpacing: number;
    verticalSpacing: number;
    nodeDimensions: Dimensions,
};

export type DiagramNode = {
    centerPosition: Point;
    dimensions: Dimensions;
};

export type DiagramArrow = {
    startPosition: Point;
    endPosition: Point;
};
