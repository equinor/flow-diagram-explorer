import React from "react";
import Fab from "@material-ui/core/Fab";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import FilterCenterFocusIcon from "@material-ui/icons/FilterCenterFocus";

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
            <Fab aria-label="zoom in" onClick={() => handleActionTriggered(MapActionType.ZoomIn)}>
                <ZoomInIcon />
            </Fab>
            <Fab aria-label="zoom out" onClick={() => handleActionTriggered(MapActionType.ZoomOut)}>
                <ZoomOutIcon />
            </Fab>
            <Fab aria-label="center view" onClick={() => handleActionTriggered(MapActionType.CenterView)}>
                <FilterCenterFocusIcon />
            </Fab>
        </div>
    );
};
