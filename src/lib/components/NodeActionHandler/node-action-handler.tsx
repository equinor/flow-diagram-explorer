import React from "react";

import { Diagram } from "../../utils/diagram-drawer-advanced";
import { DiagramConfigContext } from "../FlowDiagramExplorer/flow-diagram-explorer";
import { Point } from "../../types/point";
import { Size } from "../../types/size";
import { ScenePropsType } from "../Scene/scene";

type NodeActionHandlerPropsType = {
    sceneProperties?: Diagram;
    centerPoint?: Point;
    viewSize?: Size;
    onNodeClick?: (nodeId: string) => void;
    onDiagramChange?: (diagramId: string) => void;
    children?: React.ReactElement<ScenePropsType> | React.ReactElement<ScenePropsType>[];
};

export const NodeActionHandler: React.FC<NodeActionHandlerPropsType> = (props) => {
    const children = props.children ? (Array.isArray(props.children) ? props.children : [props.children]) : [];
    const [highlightedSceneItems, setHighlightedSceneItems] = React.useState<
        { svg: SVGElement; originalColor: string; originalZIndex: string }[]
    >([]);
    const childRef = React.useRef<HTMLDivElement>(null);
    const diagramConfig = React.useContext(DiagramConfigContext);

    const handleMouseEnter = React.useCallback(
        (id: string) => {
            if (childRef.current && props.sceneProperties !== null) {
                const highlighted: { svg: SVGElement; originalColor: string; originalZIndex: string }[] = [];
                const sceneItems: Element[] = [...childRef.current.getElementsByClassName("SceneItem")].filter(
                    (htmlElement: Element) => {
                        const nodeEdges = (props.sceneProperties as Diagram).flowNodeEdgeMap.find((el) => el.id === id);
                        if (nodeEdges) {
                            return nodeEdges.edgeIndices.some(
                                (el) =>
                                    htmlElement.getAttribute("data-id") &&
                                    htmlElement.getAttribute("data-id") === `edge-${el}`
                            );
                        }
                        return false;
                    }
                );
                sceneItems.forEach((item) => {
                    if (item.children) {
                        const child = item.children[0];
                        if (child.tagName.toLowerCase() === "svg") {
                            const polyline =
                                child.children.length > 0 &&
                                child.children[child.children.length - 1].tagName.toLowerCase() === "polyline"
                                    ? child.children[child.children.length - 1]
                                    : undefined;
                            if (polyline) {
                                highlighted.push({
                                    svg: child as SVGElement,
                                    originalColor: (polyline as SVGPolylineElement).getAttribute("stroke") || "black",
                                    originalZIndex: (child as SVGElement).style.zIndex,
                                });
                                polyline.setAttribute("stroke", diagramConfig.highlightColor);
                                if (polyline.getAttribute("marker-end")) {
                                    polyline.setAttribute(
                                        "marker-end",
                                        (polyline.getAttribute("marker-end") as string).replace(")", "-hover)")
                                    );
                                }
                                if (child.parentElement) {
                                    child.parentElement.style.zIndex = "5";
                                }
                            }
                        }
                    }
                });
                setHighlightedSceneItems(highlighted);
            }
        },
        [childRef, props.sceneProperties, setHighlightedSceneItems]
    );

    const handleMouseLeave = React.useCallback(() => {
        highlightedSceneItems.forEach(({ svg, originalColor, originalZIndex }) => {
            const line = svg.getElementsByTagName("polyline")[svg.getElementsByTagName("polyline").length - 1];
            (line as SVGPolylineElement).setAttribute("stroke", originalColor);
            if ((line as SVGPolylineElement).getAttribute("marker-end")) {
                (line as SVGPolylineElement).setAttribute(
                    "marker-end",
                    ((line as SVGPolylineElement).getAttribute("marker-end") as string).replace("-hover", "")
                );
            }
            if (svg.parentElement) {
                svg.parentElement.style.zIndex = originalZIndex;
            }
        });
    }, [highlightedSceneItems, setHighlightedSceneItems]);

    return (
        <div ref={childRef}>
            {children &&
                (children as React.ReactElement<ScenePropsType>[]).map((child: React.ReactElement<ScenePropsType>) => {
                    return (
                        <React.Fragment key={`scene-${child.props.id}`}>
                            {React.cloneElement(child, {
                                viewSize: props.viewSize,
                                centerPoint: props.centerPoint,
                                onNodeEnter: handleMouseEnter,
                                onNodeLeave: handleMouseLeave,
                            })}
                        </React.Fragment>
                    );
                })}
        </div>
    );
};
