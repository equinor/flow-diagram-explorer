import dayjs, { Dayjs } from "dayjs";

import { FlowDiagram, DiagramConfig } from "../../types/diagram";
import { Diagram, DiagramDrawer } from "../../utils/diagram-drawer-advanced";

type ActionMap<M extends { [index: string]: { [key: string]: string | Dayjs | number | FlowDiagram[] } }> = {
    [Key in keyof M]: M[Key] extends undefined
        ? {
              type: Key;
          }
        : {
              type: Key;
              payload: M[Key];
          };
};

export enum DiagramActionTypes {
    MoveDown = "MOVE_DOWN",
    MoveUpToNode = "MOVE_UP_TO_NODE",
    ChangeDate = "CHANGE_DATE",
    ChangeDiagram = "CHANGE_DIAGRAM",
}

type DiagramReducerStateType = {
    fixed: {
        flowDiagrams: FlowDiagram[];
        diagramConfig: DiagramConfig;
        globalStartDate: Dayjs;
        globalEndDate: Dayjs;
    };
    currentPath: PathElement[];
    currentDate: Dayjs;
    currentDiagram?: Diagram;
};

type Payload = {
    [DiagramActionTypes.MoveDown]: {
        id: string;
    };
    [DiagramActionTypes.MoveUpToNode]: {
        nodeId: string;
    };
    [DiagramActionTypes.ChangeDate]: {
        date: Dayjs;
    };
    [DiagramActionTypes.ChangeDiagram]: {
        diagram: FlowDiagram[];
    };
};

type Actions = ActionMap<Payload>[keyof ActionMap<Payload>];

type TimeFrame = {
    startDate: Dayjs;
    endDate: Dayjs;
};

type PathElement = {
    id: string;
    title: string;
    timeframes: TimeFrame[];
};

export const DiagramReducerInit = ({
    flowDiagrams,
    diagramConfig,
}: {
    flowDiagrams: FlowDiagram[];
    diagramConfig: DiagramConfig;
}): DiagramReducerStateType => {
    let startDate: string | undefined = undefined;
    let endDate: string | undefined = undefined;
    let id = "";
    let diagram: Diagram | undefined = undefined;
    let title = "";
    const timeframes: TimeFrame[] = [];

    if (flowDiagrams.length > 0) {
        id = flowDiagrams[0].id;
        startDate = flowDiagrams[0].startDate;
        endDate = flowDiagrams[0].endDate;

        flowDiagrams.forEach((diagram) => {
            if (diagram.startDate && (!startDate || dayjs(diagram.startDate).isBefore(dayjs(startDate)))) {
                startDate = diagram.startDate;
            }
            if (diagram.endDate && (!endDate || dayjs(diagram.endDate).isAfter(dayjs(endDate)))) {
                endDate = diagram.endDate;
            }
        });
        const diagramDrawer = new DiagramDrawer(flowDiagrams[0], diagramConfig);
        diagram = diagramDrawer.diagram();
        title = flowDiagrams[0].title;

        flowDiagrams.forEach((el) => {
            timeframes.push({ startDate: dayjs(el.startDate || startDate), endDate: dayjs(el.endDate || endDate) });
        });
    }
    return {
        fixed: {
            flowDiagrams: flowDiagrams,
            diagramConfig: diagramConfig,
            globalStartDate: dayjs(startDate),
            globalEndDate: dayjs(endDate),
        },
        currentPath: [{ id: id, title: title, timeframes: timeframes }],
        currentDate: dayjs(startDate),
        currentDiagram: diagram,
    };
};

const findAndCreateDiagram = (
    flowDiagrams: FlowDiagram[],
    date: Dayjs,
    path: PathElement[],
    state: DiagramReducerStateType
): Diagram | undefined => {
    let currentDiagram = flowDiagrams.find((el) => date.isBetween(dayjs(el.startDate), dayjs(el.endDate), null, "[]"));
    path.forEach((pathElement, index) => {
        if (index > 0 && currentDiagram) {
            const node = currentDiagram.nodes.find((el) => el.id === pathElement.id);
            if (node && node.subdiagram) {
                let subdiagrams: FlowDiagram[] = [];
                if (Array.isArray(node.subdiagram)) {
                    subdiagrams = node.subdiagram;
                } else {
                    subdiagrams = [node.subdiagram];
                }
                currentDiagram = subdiagrams.find((el) => {
                    const subdiagramStartDate = el.startDate || state.fixed.globalStartDate;
                    const subdiagramEndDate = el.endDate || state.fixed.globalEndDate;
                    return date.isBetween(dayjs(subdiagramStartDate), dayjs(subdiagramEndDate), null, "[]");
                });
            }
        }
    });
    const diagramDrawer = currentDiagram ? new DiagramDrawer(currentDiagram, state.fixed.diagramConfig) : undefined;
    return diagramDrawer?.diagram();
};

const findTimeFrames = (flowDiagrams: FlowDiagram[], path: string[], state: DiagramReducerStateType) => {
    const foundFrames: PathElement[] = [];
    const findTimeFramesRecursively = (diagrams: FlowDiagram[], pathPosition: number) => {
        pathPosition++;
        diagrams.forEach((diagram) => {
            const pathElement = foundFrames.find((el) => el.id === diagram.id);
            if (pathElement) {
                if (
                    !pathElement.timeframes.find(
                        (el) =>
                            el.startDate.isSame(dayjs(diagram.startDate || state.fixed.globalStartDate)) &&
                            el.endDate.isSame(dayjs(diagram.endDate || state.fixed.globalEndDate))
                    )
                ) {
                    pathElement.timeframes.push({
                        startDate: dayjs(diagram.startDate || state.fixed.globalStartDate),
                        endDate: dayjs(diagram.endDate || state.fixed.globalEndDate),
                    });
                }
            } else {
                foundFrames.push({
                    id: diagram.id,
                    title: diagram.title,
                    timeframes: [
                        {
                            startDate: dayjs(diagram.startDate || state.fixed.globalStartDate),
                            endDate: dayjs(diagram.endDate || state.fixed.globalEndDate),
                        },
                    ],
                });
            }
            if (pathPosition < path.length) {
                const id = path[pathPosition];
                const node = diagram.nodes.find((el) => el.id === id);
                if (node && node.subdiagram) {
                    const subdiagrams = Array.isArray(node.subdiagram) ? node.subdiagram : [node.subdiagram];
                    findTimeFramesRecursively(subdiagrams, pathPosition);
                }
            }
        });
    };
    findTimeFramesRecursively(flowDiagrams, 0);
    return foundFrames;
};

export const DiagramReducer = (state: DiagramReducerStateType, action: Actions): DiagramReducerStateType => {
    switch (action.type) {
        case DiagramActionTypes.MoveDown: {
            // Find child node with id and create and set new diagram
            const pathIds = [...state.currentPath.map((el) => el.id), action.payload.id];
            const newPath = findTimeFrames(state.fixed.flowDiagrams, pathIds, state);
            if (newPath.length !== pathIds.length) {
                return state;
            }
            const diagram = findAndCreateDiagram(state.fixed.flowDiagrams, state.currentDate, newPath, state);
            return {
                ...state,
                currentPath: newPath,
                currentDiagram: diagram,
            };
        }
        case DiagramActionTypes.MoveUpToNode: {
            // Search for new id in path and create and set new diagram
            const pathIds = state.currentPath.reduce((reducedPath: string[], el: PathElement) => {
                if (reducedPath.length === 0 || reducedPath[reducedPath.length - 1] !== action.payload.nodeId) {
                    reducedPath.push(el.id);
                }
                return reducedPath;
            }, []);
            const newPath = findTimeFrames(state.fixed.flowDiagrams, pathIds, state);

            const diagram = findAndCreateDiagram(state.fixed.flowDiagrams, state.currentDate, newPath, state);
            return {
                ...state,
                currentPath: newPath,
                currentDiagram: diagram,
            };
        }
        case DiagramActionTypes.ChangeDate: {
            // Check if the current diagram contains the given date or find new diagram on same level which contains the given date
            const oldIndex = state.currentPath[state.currentPath.length - 1].timeframes.findIndex((el) =>
                state.currentDate.isBetween(el.startDate, el.endDate, null, "[]")
            );
            const newIndex = state.currentPath[state.currentPath.length - 1].timeframes.findIndex((el) =>
                action.payload.date.isBetween(el.startDate, el.endDate, null, "[]")
            );
            if (oldIndex !== newIndex) {
                const diagram = findAndCreateDiagram(
                    state.fixed.flowDiagrams,
                    action.payload.date,
                    state.currentPath,
                    state
                );
                return {
                    ...state,
                    currentDate: action.payload.date,
                    currentDiagram: diagram,
                };
            } else {
                return {
                    ...state,
                    currentDate: action.payload.date,
                };
            }
        }
        case DiagramActionTypes.ChangeDiagram: {
            return DiagramReducerInit({
                flowDiagrams: action.payload.diagram,
                diagramConfig: state.fixed.diagramConfig,
            });
        }
    }
};
