import React from "react";
import { FlowDiagram } from "../../lib/types/diagram";
import { windTurbineSystemRenderer, installationRenderer, cableRenderer } from "../../lib/render-library";

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

export const installation: FlowDiagram = {
    id: "installation",
    title: "World",
    nodes: [
        {
            id: "input",
            title: "Input",
            render: renderInputOutputNode,
        },
        {
            id: "windfarm1",
            title: "Wind farm 1",
            render: windTurbineSystemRenderer,
        },
        {
            id: "windfarm2",
            title: "Wind farm 2",
            render: windTurbineSystemRenderer,
        },
        {
            id: "windfarm3",
            title: "Wind farm 3",
            render: windTurbineSystemRenderer,
        },
        {
            id: "power-from-shore",
            title: "Power from shore",
            render: cableRenderer,
        },
        {
            id: "installation",
            title: "Installation",
            render: installationRenderer,
        },
        {
            id: "oil-output",
            title: "Oil output",
            render: renderInputOutputNode,
        },
        {
            id: "emissions-output",
            title: "Output",
            render: renderInputOutputNode,
        },
        {
            id: "electricity-output",
            title: "Output",
            render: renderInputOutputNode,
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
        { id: "emissions", label: "Emissions", style: { strokeColor: "#A7B0B6", strokeStyle: "0" } },
        { id: "fuel", label: "Fuel", style: { strokeColor: "#A7B0B6", strokeStyle: "0" } },
        { id: "oil", label: "Oil", style: { strokeColor: "#F75D36", strokeStyle: "0" } },
    ],
    edges: [
        { flow: "electricity-import", from: "windfarm1", to: "installation" },
        { flow: "electricity-import", from: "windfarm2", to: "installation" },
        { flow: "electricity-import", from: "windfarm3", to: "installation" },
        { flow: "electricity-import", from: "power-from-shore", to: "installation" },
        { flow: "fuel", from: "input", to: "installation" },
        { flow: "emissions", from: "installation", to: "emissions-output" },
        { flow: "oil", from: "installation", to: "oil-output" },
        { flow: "electricity-export", from: "installation", to: "electricity-output" },
    ],
};
