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
    node: string;
};

export type DiagramArrow = {
    points: Point[]
};
