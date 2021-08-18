import React from "react";
import { FlowDiagram } from "../../lib/types/diagram";
import { pumpRenderer } from "../../lib/render-library";

const renderInputOutputNode = (): { html: JSX.Element; width: number; height: number } => {
    return {
        html: (
            <div
                style={{
                    width: 0,
                    height: 0,
                }}
            ></div>
        ),
        width: 0,
        height: 100,
    };
};

export const installationDetails: FlowDiagram = {
    id: "installation1",
    title: "Installation",
    nodes: [
        {
            id: "input",
            title: "Input",
            render: renderInputOutputNode,
        },
        {
            id: "pump1",
            title: "Pump 1",
            render: pumpRenderer,
        },
        {
            id: "pump2",
            title: "Pump 2",
            render: pumpRenderer,
        },
        {
            id: "pump3",
            title: "Pump 3",
            render: pumpRenderer,
        },
        {
            id: "pump4",
            title: "Pump 4",
            render: pumpRenderer,
        },
    ],
    flows: [{ id: "something", label: "Something", style: { strokeColor: "#A7B0B6", strokeStyle: "0" } }],
    edges: [
        { flow: "something", from: "input", to: "pump1" },
        { flow: "something", from: "input", to: "pump2" },
        { flow: "something", from: "input", to: "pump3" },
        { flow: "something", from: "input", to: "pump4" },
    ],
};
