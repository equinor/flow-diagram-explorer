import React from "react";

import { FlowDiagram } from "../../lib/types/diagram";

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

export const ComplexInstallation: FlowDiagram = {
    id: "installation",
    title: "World",
    startDate: "2005-12-18",
    endDate: "2019-05-05",
    nodes: [
        {
            id: "input",
            title: "Input",
            type: "input-output-node",
        },
        {
            id: "turbine-generator-set",
            title: "Turbine generator set",
            type: "turbine-generator-set",
        },
        {
            id: "engine-generator-set",
            title: "Engine generator set",
            type: "engine-generator-set",
        },
        {
            id: "windfarm",
            title: "Wind farm",
            type: "wind-turbine-system",
        },
        {
            id: "power-from-shore",
            title: "Power from shore",
            type: "cable",
        },
        {
            id: "pump-system",
            title: "Pump system",
            type: "pump-system",
        },
        {
            id: "compressor-system",
            title: "Compressor system",
            type: "compressor-system",
        },
        {
            id: "installation",
            title: "Installation",
            type: "installation",
        },
        {
            id: "direct",
            title: "Direct",
            type: "direct",
        },
        {
            id: "tabulated",
            title: "Tabulated",
            type: "tabulated",
        },
        {
            id: "oil-output",
            title: "Oil output",
            type: "input-output-node",
        },
        {
            id: "emissions-output",
            title: "Output",
            type: "input-output-node",
        },
        {
            id: "electricity-output",
            title: "Output",
            type: "input-output-node",
        },
    ],
    flows: [
        {
            id: "electricity-import",
            label: "Electricity import",
            style: { strokeColor: "#A7B0B6", strokeStyle: "6 2" },
        },
        {
            id: "electricity-export",
            label: "Electricity export",
            style: { strokeColor: "#A7B0B6", strokeStyle: "6 2" },
        },
        { id: "electricity", label: "Electricity", style: { strokeColor: "#FABA00", strokeStyle: "0" } },
        { id: "emissions", label: "Emissions", style: { strokeColor: "#A7B0B6", strokeStyle: "1 2" } },
        { id: "fuel", label: "Fuel", style: { strokeColor: "#A7B0B6", strokeStyle: "0" } },
        { id: "oil", label: "Oil", style: { strokeColor: "#F75D36", strokeStyle: "0" } },
        { id: "air", label: "Air", style: { strokeColor: "#2499E0", strokeStyle: "0" } },
    ],
    edges: [
        { flow: "fuel", fromNode: "input", toNode: "turbine-generator-set" },
        { flow: "fuel", fromNode: "input", toNode: "engine-generator-set" },
        { flow: "emissions", fromNode: "turbine-generator-set", toNode: "emissions-output" },
        { flow: "emissions", fromNode: "engine-generator-set", toNode: "emissions-output" },
        { flow: "electricity", fromNode: "turbine-generator-set", toNode: "pump-system" },
        { flow: "electricity", fromNode: "engine-generator-set", toNode: "pump-system" },
        { flow: "electricity", fromNode: "windfarm", toNode: "pump-system" },
        { flow: "electricity-import", fromNode: "power-from-shore", toNode: "pump-system" },
        { flow: "electricity", fromNode: "turbine-generator-set", toNode: "compressor-system" },
        { flow: "electricity", fromNode: "engine-generator-set", toNode: "compressor-system" },
        { flow: "electricity", fromNode: "windfarm", toNode: "compressor-system" },
        { flow: "electricity-import", fromNode: "power-from-shore", toNode: "compressor-system" },
        { flow: "oil", fromNode: "pump-system", toNode: "direct" },
        { flow: "oil", fromNode: "pump-system", toNode: "tabulated" },
        { flow: "air", fromNode: "compressor-system", toNode: "installation" },
        { flow: "emissions", fromNode: "installation", toNode: "emissions-output" },
        { flow: "oil", fromNode: "installation", toNode: "oil-output" },
        { flow: "electricity-export", fromNode: "installation", toNode: "electricity-output" },
    ],
};
