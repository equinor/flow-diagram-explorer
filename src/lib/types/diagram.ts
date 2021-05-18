import { Size } from "./dimensions";
import { Point } from "./point";
import { Flow } from "./nodes";

export type DiagramConfig = {
    horizontalSpacing: number;
    verticalSpacing: number;
    nodeDimensions: Size,
};

export type DiagramNode = {
    id: string;
    centerPosition: Point;
    size: Size;
    html: JSX.Element;
};

export type DiagramArrow = {
    flow: Flow;
    points: Point[];
    label: string;
    labelPosition: Point;
};
