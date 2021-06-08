import React from "react";
import Fab from "@material-ui/core/Fab";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import FilterCenterFocusIcon from "@material-ui/icons/FilterCenterFocus";
import { Tooltip } from "@equinor/eds-core-react";

import "./map-actions.css";

export enum MapActionType {
    ZoomIn = 0,
    ZoomOut,
    CenterView,
}

export const MapActions = (props: {
    onActionTriggered: (action: MapActionType, data?: { [key: string]: string | boolean | number }) => void;
}): JSX.Element => {
    const handleActionTriggered = React.useCallback(
        (action: MapActionType) => {
            props.onActionTriggered(action);
        },
        [props.onActionTriggered]
    );

    return (
        <div className="MapActions">
            <Tooltip title="Zoom in" placement="left">
                <Fab aria-label="zoom in" onClick={() => handleActionTriggered(MapActionType.ZoomIn)}>
                    <ZoomInIcon />
                </Fab>
            </Tooltip>
            <Tooltip title="Zoom out" placement="left">
                <Fab aria-label="zoom out" onClick={() => handleActionTriggered(MapActionType.ZoomOut)}>
                    <ZoomOutIcon />
                </Fab>
            </Tooltip>
            <Tooltip title="View all" placement="left">
                <Fab aria-label="view all" onClick={() => handleActionTriggered(MapActionType.CenterView)}>
                    <FilterCenterFocusIcon />
                </Fab>
            </Tooltip>
        </div>
    );
};
