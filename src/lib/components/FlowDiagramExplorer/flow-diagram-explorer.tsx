import React from "react";
import dayjs from "dayjs";

import { DiagramDrawer, Diagram } from "../../utils/diagram-drawer";
import { Scene } from "../Scene";
import { Map } from "../Map";
import { FlowDiagram } from "../../types/diagram";
import { DiagramSkeleton } from "../DiagramSkeleton/diagram-skeleton";
import { Breadcrumbs } from "@equinor/eds-core-react";
import { DiagramConfig } from "../../types/diagram";
import { Timeline } from "../Timeline";

import "./flow-diagram-explorer.css";

const defaultDiagramConfig: DiagramConfig = {
    horizontalSpacing: 80,
    verticalSpacing: 50,
    highlightColor: "#DF323D",
    backgroundColor: "#F7F7F7",
    defaultEdgeStrokeWidth: 2,
    defaultEdgeArrowSize: 16,
    defaultEdgeStrokeColor: "#000",
    defaultEdgeStrokeStyle: "0",
};

type FlowDiagramExplorerPropsType = {
    flowDiagram: FlowDiagram;
    diagramConfig?: DiagramConfig;
    onNodeClick?: (nodeId: string) => void;
    onDiagramChange?: (title: string) => void;
};

const FlowDiagramExplorer: React.FC<FlowDiagramExplorerPropsType> = (props) => {
    const diagramConfig = props.diagramConfig || defaultDiagramConfig;
    const [levels, setLevels] = React.useState<{ id: string; title: string; diagram: Diagram }[]>([]);
    const [sceneProperties, setSceneProperties] = React.useState<Diagram | null>(null);
    const [highlightedSceneItems, setHighlightedSceneItems] = React.useState<
        { svg: SVGElement; originalColor: string; originalZIndex: string }[]
    >([]);
    const mapRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const drawer = new DiagramDrawer(props.flowDiagram, diagramConfig);
        setSceneProperties(drawer.diagram());
        const index = levels.findIndex((el) => el.title === props.flowDiagram.title);
        if (index === -1) {
            setLevels([
                ...levels,
                { id: props.flowDiagram.id, title: props.flowDiagram.title, diagram: drawer.diagram() },
            ]);
        } else {
            setLevels([{ id: props.flowDiagram.id, title: props.flowDiagram.title, diagram: drawer.diagram() }]);
        }
    }, [props.flowDiagram, diagramConfig]);

    const handleMouseEnter = React.useCallback(
        (id: string) => {
            if (mapRef.current && sceneProperties !== null) {
                const highlighted: { svg: SVGElement; originalColor: string; originalZIndex: string }[] = [];
                const sceneItems: Element[] = [...mapRef.current.getElementsByClassName("SceneItem")].filter(
                    (htmlElement: Element) => {
                        const nodeEdges = sceneProperties.flowNodeEdgeMap.find((el) => el.id === id);
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
        [mapRef, sceneProperties, setHighlightedSceneItems]
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

    const handleLevelClicked = (
        e: React.MouseEvent<HTMLAnchorElement>,
        level: { id: string; title: string; diagram: Diagram }
    ) => {
        const index = levels.findIndex((el) => el.title === level.title);
        setLevels(levels.filter((_, idx) => idx <= index));
        if (props.onDiagramChange) {
            props.onDiagramChange(level.id);
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
                                            key={level.id}
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
                    <div className="TimelineContainer">
                        <Timeline
                            timeFrames={[
                                {
                                    id: "0",
                                    fromDate: dayjs("12-18-2018"),
                                    toDate: dayjs("05-01-2019"),
                                },
                                {
                                    id: "1",
                                    fromDate: dayjs("05-02-2019"),
                                    toDate: dayjs("06-20-2019"),
                                },
                                {
                                    id: "2",
                                    fromDate: dayjs("06-21-2019"),
                                    toDate: dayjs("09-01-2019"),
                                },
                                {
                                    id: "3",
                                    fromDate: dayjs("09-02-2019"),
                                    toDate: dayjs("02-21-2020"),
                                },
                                {
                                    id: "4",
                                    fromDate: dayjs("02-22-2020"),
                                    toDate: dayjs("04-01-2020"),
                                },
                                {
                                    id: "5",
                                    fromDate: dayjs("04-02-2020"),
                                    toDate: dayjs("04-25-2020"),
                                },
                                {
                                    id: "6",
                                    fromDate: dayjs("04-26-2020"),
                                    toDate: dayjs("05-20-2020"),
                                },
                                {
                                    id: "7",
                                    fromDate: dayjs("05-21-2020"),
                                    toDate: dayjs("08-15-2020"),
                                },
                                {
                                    id: "8",
                                    fromDate: dayjs("08-16-2020"),
                                    toDate: dayjs("08-30-2020"),
                                },
                                {
                                    id: "9",
                                    fromDate: dayjs("08-31-2020"),
                                    toDate: dayjs("09-10-2020"),
                                },
                            ]}
                        />
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
                        id={props.flowDiagram.id}
                        config={diagramConfig}
                    />
                </>
            ) : (
                <DiagramSkeleton />
            )}
        </div>
    );
};

export default FlowDiagramExplorer;
