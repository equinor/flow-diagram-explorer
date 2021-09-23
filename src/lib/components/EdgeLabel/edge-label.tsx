import React from "react";

import { Size } from "../../types/size";

import "./edge-label.css";

type EdgeLabelPropsType = {
    label: string;
    size: Size;
};

export const EdgeLabel: React.FC<EdgeLabelPropsType> = (props) => {
    const { label } = props;
    return <div className="FlowDiagramExplorer__EdgeLabel">{label}</div>;
};
