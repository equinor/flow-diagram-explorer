import React from "react";
import { FlowDiagram } from "../../lib/types/diagram";

export const installationDetails: FlowDiagram = {
    id: "installation1",
    title: "Installation",
    nodes: [
        {
            id: "input",
            title: "Input",
            type: "input-output-node",
        },
        {
            id: "pump1",
            title: "Pump 1",
            type: "pump",
        },
        {
            id: "pump2",
            title: "Pump 2",
            type: "pump",
        },
        {
            id: "pump3",
            title: "Pump 3",
            type: "pump",
        },
        {
            id: "pump4",
            title: "Pump 4",
            type: "pump",
        },
    ],
    flows: [{ id: "something", label: "Something" }],
    edges: [
        { flow: "something", fromNode: "input", toNode: "pump1" },
        { flow: "something", fromNode: "input", toNode: "pump2" },
        { flow: "something", fromNode: "input", toNode: "pump3" },
        { flow: "something", fromNode: "input", toNode: "pump4" },
    ],
};
