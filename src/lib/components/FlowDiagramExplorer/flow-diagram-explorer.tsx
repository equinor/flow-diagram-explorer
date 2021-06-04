import React from "react";

import { DiagramDrawer, Diagram } from "../../utils/diagram-drawer";
import { Scene } from "../Scene";
import { Map } from "../Map";
import { FlowDiagram } from "../../types/nodes";
import { DiagramSkeleton } from "../DiagramSkeleton/diagram-skeleton";
import { Breadcrumbs } from "@equinor/eds-core-react";

import "./flow-diagram-explorer.css";

type FlowDiagramExplorerPropsType = {
    flowDiagram: FlowDiagram;
    onNodeClick?: (nodeId: string) => void;
    onDiagramChange?: (title: string) => void;
};

const FlowDiagramExplorer: React.FC<FlowDiagramExplorerPropsType> = (
    props: FlowDiagramExplorerPropsType
): JSX.Element => {
    const [levels, setLevels] = React.useState<{ title: string; diagram: Diagram }[]>([]);
    const [sceneProperties, setSceneProperties] = React.useState<Diagram | null>(null);
    const [highlightedSceneItems, setHighlightedSceneItems] = React.useState<
        { svg: SVGElement; originalColor: string; originalZIndex: string }[]
    >([]);
    const mapRef = React.useRef<HTMLDivElement>(null);

    const highlightColor = "#DF323D";

    React.useEffect(() => {
        const result = DiagramDrawer({
            flowDiagram: props.flowDiagram,
        });
        setSceneProperties(result);
        const index = levels.findIndex((el) => el.title === props.flowDiagram.title);
        if (index === -1) {
            setLevels([...levels, { title: props.flowDiagram.title, diagram: result }]);
        } else {
            setLevels([{ title: props.flowDiagram.title, diagram: result }]);
        }
    }, [props.flowDiagram]);

    const handleMouseEnter = React.useCallback(
        (id: string) => {
            if (mapRef.current && sceneProperties != null) {
                const highlighted: { svg: SVGElement; originalColor: string; originalZIndex: string }[] = [];
                const sceneItems: HTMLElement[] = [].filter.call(
                    mapRef.current.getElementsByClassName("SceneItem"),
                    (htmlElement: HTMLElement) => {
                        const nodeEdges = sceneProperties.flowNodeEdgeMap.find((el) => el.id === id);
                        if (nodeEdges) {
                            return nodeEdges.edgeIndices.some(
                                (el) =>
                                    htmlElement.getAttribute("data-id") &&
                                    htmlElement.getAttribute("data-id")! === `edge-${el}`
                            );
                        }
                        return false;
                    }
                );
                sceneItems.forEach((item) => {
                    const child = item.children![0];
                    if (child.tagName.toLowerCase() === "svg") {
                        const polyline =
                            child.children.length > 0 &&
                            child.children[child.children.length - 1].tagName.toLowerCase() === "polyline"
                                ? child.children[child.children.length - 1]
                                : undefined;
                        if (polyline) {
                            highlighted.push({
                                svg: child as SVGElement,
                                originalColor: (polyline as SVGPolylineElement).getAttribute("stroke")!,
                                originalZIndex: (child as SVGElement).style.zIndex,
                            });
                            polyline.setAttribute("stroke", highlightColor);
                            if (polyline.getAttribute("marker-end")) {
                                polyline.setAttribute(
                                    "marker-end",
                                    polyline.getAttribute("marker-end")!.replace(")", "-hover)")
                                );
                            }
                            if (child.parentElement) {
                                child.parentElement.style.zIndex = "5";
                            }
                        }
                    }
                });
                setHighlightedSceneItems(highlighted);
            }
        },
        [mapRef, sceneProperties, setHighlightedSceneItems]
    );

    const handleMouseLeave = React.useCallback(() => {
        highlightedSceneItems.forEach(({ svg, originalColor, originalZIndex }) => {
            const line = svg.getElementsByTagName("polyline")[svg.getElementsByTagName("polyline").length - 1];
            (line as SVGPolylineElement).setAttribute("stroke", originalColor);
            if ((line as SVGPolylineElement).getAttribute("marker-end")) {
                (line as SVGPolylineElement).setAttribute(
                    "marker-end",
                    (line as SVGPolylineElement).getAttribute("marker-end")!.replace("-hover", "")
                );
            }
            if (svg.parentElement) {
                svg.parentElement.style.zIndex = originalZIndex;
            }
        });
    }, [highlightedSceneItems, setHighlightedSceneItems]);

    const handleLevelClicked = (e: React.MouseEvent<HTMLAnchorElement>, level: { title: string; diagram: Diagram }) => {
        const index = levels.findIndex((el) => el.title === level.title);
        setLevels(levels.filter((_, idx) => idx <= index));
        if (props.onDiagramChange) {
            props.onDiagramChange(level.title);
        }
        e.preventDefault();
    };

    return (
        <div className="FlowDiagramExplorer" ref={mapRef}>
            {sceneProperties !== null ? (
                <>
                    <div className="Levels">
                        <Breadcrumbs>
                            {levels.map((level, index, array) => {
                                if (index === array.length - 1) {
                                    return (
                                        <Breadcrumbs.Breadcrumb
                                            key={level.title}
                                            href="#"
                                            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.preventDefault()}
                                        >
                                            {level.title}
                                        </Breadcrumbs.Breadcrumb>
                                    );
                                } else {
                                    return (
                                        <Breadcrumbs.Breadcrumb
                                            href="#"
                                            onClick={(e: React.MouseEvent<HTMLAnchorElement>) =>
                                                handleLevelClicked(e, level)
                                            }
                                        >
                                            {level.title}
                                        </Breadcrumbs.Breadcrumb>
                                    );
                                }
                            })}
                        </Breadcrumbs>
                    </div>
                    <Map
                        Scene={
                            <Scene
                                size={sceneProperties.sceneSize}
                                onNodeClick={props.onNodeClick || undefined}
                                onNodeEnter={handleMouseEnter}
                                onNodeLeave={handleMouseLeave}
                            >
                                {sceneProperties.sceneItems}
                            </Scene>
                        }
                        width="100%"
                        height="95vh"
                        sceneSize={sceneProperties.sceneSize}
                        margin={200}
                        id={props.flowDiagram.id}
                    />
                </>
            ) : (
                <DiagramSkeleton />
            )}
        </div>
    );
};

export default FlowDiagramExplorer;
