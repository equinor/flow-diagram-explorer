import React from "react";
import Fab from "@material-ui/core/Fab";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import FilterCenterFocusIcon from "@material-ui/icons/FilterCenterFocus";

import "./map-actions.css";

export const MapActions = (): JSX.Element => {
    return (
        <div className="MapActions">
            <Fab aria-label="zoom in">
                <ZoomInIcon />
            </Fab>
            <Fab aria-label="zoom out">
                <ZoomOutIcon />
            </Fab>
            <Fab aria-label="center view">
                <FilterCenterFocusIcon />
            </Fab>
        </div>
    );
};
