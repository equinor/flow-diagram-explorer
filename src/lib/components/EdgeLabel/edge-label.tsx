import React from "react";

import { Size } from "../../types/dimensions";

import "./edge-label.css";

type EdgeLabelPropsType = {
    label: string;
    size: Size;
};

export const EdgeLabel: React.FC<EdgeLabelPropsType> = (props: EdgeLabelPropsType): JSX.Element => {
    const { label } = props;
    return (
        <div className="EdgeLabel">{label}</div>
    );
};
