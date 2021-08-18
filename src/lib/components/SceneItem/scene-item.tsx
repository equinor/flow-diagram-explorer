import React from "react";

import {
    isPartlyContained,
    pointMultiplyWithScalar,
    pointDifference,
    pointSum,
    sizeMultiplyWithScalar,
    sizeDifference,
    sizeSum,
} from "../../utils/geometry";
import { Point } from "../../types/point";
import { Size } from "../../types/size";

import "./scene-item.css";

export enum SceneItemType {
    Node = 0,
    Flow,
    Definition,
    Label,
}

export type SceneItemPropsType = {
    id: string;
    type: SceneItemType;
    size: Size;
    position: Point;
    zIndex: number;
    onMouseEnter?: (id: string) => void;
    onMouseLeave?: (id: string) => void;
    onClick?: (id: string) => void;
    children?: React.ReactNode;
    viewCenterPoint?: Point;
    viewSize?: Size;
    clickable: boolean;
    hoverable?: boolean;
    animation?: SceneItemAnimationType;
    animationFade?: number;
};

export type SceneItemAnimationStepType = {
    fadePosition: number;
    attributes: {
        position?: Point;
        opacity?: number;
        size?: Size;
    };
};

export type SceneItemAnimationType = {
    id: string;
    fadePositions: SceneItemAnimationStepType[];
};

export const SceneItem: React.FC<SceneItemPropsType> = (props) => {
    const {
        id,
        zIndex,
        onClick,
        viewCenterPoint,
        viewSize,
        clickable,
        onMouseEnter,
        onMouseLeave,
        animation,
        animationFade,
    } = props;

    const hoverable = props.hoverable || false;

    const currentAnimationStart =
        animation &&
        animationFade !== undefined &&
        animation.fadePositions.reverse().find((el) => el.fadePosition <= animationFade);
    const currentAnimationEnd =
        animation &&
        animationFade !== undefined &&
        animation.fadePositions.find((el) => el.fadePosition >= animationFade);

    const position =
        animation &&
        animationFade !== undefined &&
        currentAnimationStart &&
        currentAnimationEnd &&
        currentAnimationStart.attributes.position &&
        currentAnimationEnd.attributes.position
            ? pointSum(
                  currentAnimationStart.attributes.position,
                  pointMultiplyWithScalar(
                      pointDifference(
                          currentAnimationEnd.attributes.position,
                          currentAnimationStart.attributes.position
                      ),
                      animationFade
                  )
              )
            : props.position;

    const size =
        animation &&
        animationFade !== undefined &&
        currentAnimationStart &&
        currentAnimationEnd &&
        currentAnimationStart.attributes.size &&
        currentAnimationEnd.attributes.size
            ? sizeSum(
                  currentAnimationStart.attributes.size,
                  sizeMultiplyWithScalar(
                      sizeDifference(currentAnimationEnd.attributes.size, currentAnimationStart.attributes.size),
                      animationFade
                  )
              )
            : props.size;

    const opacity =
        animation &&
        animationFade !== undefined &&
        currentAnimationStart &&
        currentAnimationEnd &&
        currentAnimationStart.attributes.opacity !== undefined &&
        currentAnimationEnd.attributes.opacity !== undefined
            ? currentAnimationStart.attributes.opacity +
              (currentAnimationEnd.attributes.opacity - currentAnimationStart.attributes.opacity) * animationFade
            : 1.0;

    if (
        (viewCenterPoint && viewSize && isPartlyContained(viewCenterPoint, viewSize, position, size)) ||
        !viewCenterPoint ||
        !viewSize
    ) {
        return (
            <div
                data-id={id}
                className="SceneItem"
                style={{
                    left: position.x,
                    top: position.y,
                    zIndex: zIndex,
                    cursor: onClick && clickable ? "pointer" : "default",
                    opacity: opacity,
                    transform: `scale(${
                        Math.min(size.width, props.size.width) / Math.max(size.width, props.size.width)
                    })`,
                }}
                onClick={onClick && clickable ? () => onClick(id) : undefined}
                onMouseEnter={onMouseEnter && hoverable ? () => onMouseEnter(id) : undefined}
                onMouseLeave={onMouseLeave && hoverable ? () => onMouseLeave(id) : undefined}
            >
                {props.children}
            </div>
        );
    } else {
        return <></>;
    }
};
