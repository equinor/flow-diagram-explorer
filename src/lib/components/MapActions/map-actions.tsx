import React from "react";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import FilterCenterFocusIcon from "@material-ui/icons/FilterCenterFocus";
import { Tooltip, Button } from "@equinor/eds-core-react";

import "./map-actions.css";

export enum MapActionType {
    ZoomIn = 0,
    ZoomOut,
    CenterView,
}

type MapActionsProps = {
    onActionTriggered: (action: MapActionType, data?: { [key: string]: string | boolean | number }) => void;
};

export const MapActions: React.FC<MapActionsProps> = (props) => {
    const handleActionTriggered = React.useCallback(
        (action: MapActionType) => {
            props.onActionTriggered(action);
        },
        [props.onActionTriggered]
    );

    return (
        <div className="FlowDiagramExplorer__MapActions">
            <Tooltip title="Zoom in" placement="left">
                <Button
                    className="FlowDiagramExplorer__MapActions__Fab"
                    aria-label="zoom in"
                    onClick={() => handleActionTriggered(MapActionType.ZoomIn)}
                    variant="ghost_icon"
                >
                    <ZoomInIcon />
                </Button>
            </Tooltip>
            <Tooltip title="Zoom out" placement="left">
                <Button
                    aria-label="zoom out"
                    className="FlowDiagramExplorer__MapActions__Fab"
                    onClick={() => handleActionTriggered(MapActionType.ZoomOut)}
                    variant="ghost_icon"
                >
                    <ZoomOutIcon />
                </Button>
            </Tooltip>
            <Tooltip title="View all" placement="left">
                <Button
                    aria-label="view all"
                    className="FlowDiagramExplorer__MapActions__Fab"
                    onClick={() => handleActionTriggered(MapActionType.CenterView)}
                    variant="ghost_icon"
                >
                    <FilterCenterFocusIcon />
                </Button>
            </Tooltip>
        </div>
    );
};
