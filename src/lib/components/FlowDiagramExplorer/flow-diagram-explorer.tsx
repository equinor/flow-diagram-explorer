import React from "react";

import { DiagramDrawer, Diagram } from "../../utils/diagram-drawer";
import { Scene } from "../Scene";
import { Map } from "../Map";
import { FlowDiagram} from "../../types/nodes";
import { SceneItemPropsType } from "../SceneItem";

import "./flow-diagram-explorer.css";

type FlowDiagramExplorerPropsType = {
    flowDiagram: FlowDiagram;
    onNodeClick?: (nodeId: string) => void;
    onDiagramChange?: (title: string) => void;
}

const FlowDiagramExplorer: React.FC<FlowDiagramExplorerPropsType> = (props: FlowDiagramExplorerPropsType): JSX.Element => {
    const [levels, setLevels] = React.useState<{title: string, diagram: Diagram}[]>([])
    const [sceneItems, setSceneItems] = React.useState<React.ReactElement<SceneItemPropsType>[]>([]);
    const [sceneSize, setSceneSize] = React.useState({width: 0, height: 0});
    const [highlightedSceneItems, setHighlightedSceneItems] = React.useState<{ svg: SVGElement, originalColor: string }[]>([]);
    const mapRef = React.useRef<HTMLDivElement>(null);

    const highlightColor = "red";

    React.useEffect(() => {
        const result = DiagramDrawer({
            flowDiagram: props.flowDiagram
        });
        setSceneItems(result.sceneItems);
        setSceneSize(result.sceneSize);
        const index = levels.findIndex((el) => el.title === props.flowDiagram.title);
        if (index === -1) {
            setLevels([{title: props.flowDiagram.title, diagram: result}]);
        }
        else {
            setLevels([...levels, {title: props.flowDiagram.title, diagram: result}]);
        }
    }, [props.flowDiagram]);

    const handleMouseEnter = React.useCallback((id: string, flows: string[]) => {
        if (mapRef.current) {
            const highlighted: { svg: SVGElement, originalColor: string }[] = [];
            const sceneItems: HTMLElement[] = [].filter.call(mapRef.current.getElementsByClassName("SceneItem"), (el: HTMLElement) => flows.some(flow => el.getAttribute("data-id") && el.getAttribute("data-id")!.indexOf(flow) !== -1 && el.getAttribute("data-id")!.indexOf(id) !== -1));
            sceneItems.forEach(item => {
                const child = item.children![0];
                if (child.tagName.toLowerCase() === "svg") {
                    const polyline = child.children.length > 0 && child.children[0].tagName.toLowerCase() === "polyline" ? child.children[0] : undefined;
                    if (polyline) {
                        highlighted.push({svg: child as SVGElement, originalColor: (polyline as SVGPolylineElement).getAttribute("stroke")!});
                        polyline.setAttribute("stroke", highlightColor);
                    }
                }
            });
            setHighlightedSceneItems(highlighted);
        }
    }, [mapRef, setHighlightedSceneItems]);

    const handleMouseLeave = React.useCallback(() => {
        highlightedSceneItems.forEach(({svg, originalColor}) => {
            [].forEach.call(svg.getElementsByTagName("polyline"), (line) => {
                (line as SVGPolylineElement).setAttribute("stroke", originalColor);
            });
        });
    }, [highlightedSceneItems, setHighlightedSceneItems]);

    const handleLevelClicked = (e: React.MouseEvent<HTMLAnchorElement>, level: {title: string, diagram: Diagram}) => {
        const index = levels.findIndex((el) => el.title === level.title);
        setLevels(levels.filter((_, idx) => idx <= index));
        if (props.onDiagramChange) {
            props.onDiagramChange(level.title);
        }
        e.preventDefault();
    };
    
    return (
        <div ref={mapRef}>
            <div className="Levels">
                {levels.map(level => (
                    <><a href="#" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleLevelClicked(e, level)}>{level.title}</a> / </>
                ))}
            </div>
            <Map
                Scene={<Scene size={sceneSize} onNodeClick={props.onNodeClick || undefined} onNodeEnter={handleMouseEnter} onNodeLeave={handleMouseLeave}>{sceneItems}</Scene>}
                initialCenterPoint={{ x: 400, y: 250 }}
                width="100%"
                height="95vh"
                sceneSize={sceneSize}
                margin={200}
            />
        </div>
    );
};

export default FlowDiagramExplorer;
