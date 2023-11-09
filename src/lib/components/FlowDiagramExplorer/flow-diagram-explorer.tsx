import React from "react";
import { Dayjs } from "dayjs";
import { Scene } from "../Scene";
import { Map } from "../Map";
import { FlowDiagram, FlowStyles, RenderFunctions } from "../../types/diagram";
import { DiagramSkeleton } from "../DiagramSkeleton/diagram-skeleton";
import { Breadcrumbs } from "@equinor/eds-core-react";
import { DiagramConfig } from "../../types/diagram";
import { Timeline } from "../Timeline";
import { NodeActionHandler } from "../NodeActionHandler";
import "./flow-diagram-explorer.css";
import { DiagramReducer, DiagramReducerInit, DiagramActionTypes } from "../DiagramReducer/diagram-reducer";
import { DiagramConfigContext, defaultDiagramConfig } from "../NodeActionHandler/node-action-handler";

export type FlowDiagramExplorerProps = {
    flowDiagram: FlowDiagram | FlowDiagram[];
    width: string | number;
    height: string | number;
    renderFunctions?: RenderFunctions;
    flowStyles?: FlowStyles;
    diagramConfig?: Partial<DiagramConfig>;
    animationsOn?: boolean;
    onNodeClick?: (nodeId: string) => void;
    onDiagramChange?: (title: string) => void;
};

const FlowDiagramExplorer: React.FC<FlowDiagramExplorerProps> = (props) => {
    const diagramConfig: DiagramConfig = {
        horizontalSpacing: props.diagramConfig?.horizontalSpacing || defaultDiagramConfig.horizontalSpacing,
        verticalSpacing: props.diagramConfig?.verticalSpacing || defaultDiagramConfig.verticalSpacing,
        highlightColor: props.diagramConfig?.highlightColor || defaultDiagramConfig.highlightColor,
        backgroundColor: props.diagramConfig?.backgroundColor || defaultDiagramConfig.backgroundColor,
        defaultEdgeStrokeWidth:
            props.diagramConfig?.defaultEdgeStrokeWidth || defaultDiagramConfig.defaultEdgeStrokeWidth,
        defaultEdgeArrowSize: props.diagramConfig?.defaultEdgeArrowSize || defaultDiagramConfig.defaultEdgeArrowSize,
        defaultEdgeStrokeColor:
            props.diagramConfig?.defaultEdgeStrokeColor || defaultDiagramConfig.defaultEdgeStrokeColor,
        defaultEdgeStrokeStyle:
            props.diagramConfig?.defaultEdgeStrokeStyle || defaultDiagramConfig.defaultEdgeStrokeStyle,
        defaultRenderFunction: props.diagramConfig?.defaultRenderFunction || defaultDiagramConfig.defaultRenderFunction,
    };
    const animationsOn = props.animationsOn !== undefined ? props.animationsOn : false;
    const flowDiagrams = Array.isArray(props.flowDiagram) ? props.flowDiagram : [props.flowDiagram];

    const [state, dispatch] = React.useReducer(
        DiagramReducer,
        {
            flowDiagrams: flowDiagrams,
            diagramConfig: diagramConfig,
            renderFunctions: props.renderFunctions,
            flowStyles: props.flowStyles,
        },
        DiagramReducerInit
    );

    React.useEffect(() => {
        dispatch({ type: DiagramActionTypes.ChangeDiagram, payload: { diagram: flowDiagrams } });
    }, [props.flowDiagram]);

    return (
        <div className="FlowDiagramExplorer" style={{ width: props.width, height: props.height }}>
            <DiagramConfigContext.Provider value={diagramConfig}>
                {flowDiagrams.length > 0 ? (
                    <>
                        <div className="FlowDiagramExplorer__Levels">
                            <Breadcrumbs>
                                {state.currentPath.map((pathElement, index, array) => {
                                    if (index === array.length - 1) {
                                        return (
                                            <Breadcrumbs.Breadcrumb
                                                key={pathElement.id}
                                                href="#"
                                                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.preventDefault()}
                                            >
                                                {pathElement.title}
                                            </Breadcrumbs.Breadcrumb>
                                        );
                                    } else {
                                        return (
                                            <Breadcrumbs.Breadcrumb
                                                key={pathElement.id}
                                                href="#"
                                                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                                    e.preventDefault();
                                                    dispatch({
                                                        type: DiagramActionTypes.MoveUpToNode,
                                                        payload: {
                                                            nodeId: pathElement.id,
                                                        },
                                                    });
                                                }}
                                            >
                                                {pathElement.title}
                                            </Breadcrumbs.Breadcrumb>
                                        );
                                    }
                                })}
                            </Breadcrumbs>
                        </div>
                        <div className="FlowDiagramExplorer__TimelineContainer">
                            <Timeline
                                onDateChange={(date: Dayjs) =>
                                    dispatch({ type: DiagramActionTypes.ChangeDate, payload: { date: date } })
                                }
                                initialDate={state.fixed.globalStartDate}
                                timeFrames={state.currentPath[state.currentPath.length - 1].timeframes}
                            />
                        </div>
                        <Map
                            ActionHandler={
                                <NodeActionHandler
                                    sceneProperties={state.currentDiagram}
                                    onNodeClick={(nodeId: string) =>
                                        dispatch({
                                            type: DiagramActionTypes.MoveDown,
                                            payload: { id: nodeId },
                                        })
                                    }
                                ></NodeActionHandler>
                            }
                            Scene={
                                <Scene
                                    id={state.currentPath[state.currentPath.length - 1].id}
                                    size={
                                        state.currentDiagram ? state.currentDiagram.sceneSize : { width: 0, height: 0 }
                                    }
                                    animationsOn={animationsOn}
                                    onNodeClick={
                                        props.onNodeClick
                                            ? props.onNodeClick
                                            : (nodeId: string) =>
                                                  dispatch({
                                                      type: DiagramActionTypes.MoveDown,
                                                      payload: { id: nodeId },
                                                  })
                                    }
                                >
                                    {state.currentDiagram ? state.currentDiagram.sceneItems : []}
                                </Scene>
                            }
                            width={props.width}
                            height={props.height}
                            sceneSize={state.currentDiagram ? state.currentDiagram.sceneSize : { width: 0, height: 0 }}
                            id={state.currentPath[state.currentPath.length - 1].id}
                            config={diagramConfig}
                        />
                    </>
                ) : (
                    <DiagramSkeleton />
                )}
            </DiagramConfigContext.Provider>
        </div>
    );
};

export default FlowDiagramExplorer;
