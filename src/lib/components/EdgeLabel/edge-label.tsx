import React from "react";

import { Size } from "../../types/dimensions";

import "./edge-label.css";

type EdgeLabelPropsType = {
    label: string;
    size: Size;
};

export const EdgeLabel: React.FC<EdgeLabelPropsType> = (props: EdgeLabelPropsType): JSX.Element => {
    const { label, size } = props;
    return (
        <div className="EdgeLabel" style={{ marginLeft: -size.width / 2, marginTop: -size.height / 2 }}>{label}</div>
    );
};
