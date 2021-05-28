import React from "react";
import { FlowDiagram, FDNode } from "../../lib/types/nodes";
import { windTurbineSystemRenderer, installationRenderer, cableRenderer } from "../../lib/render-library";

const renderInputOutputNode = (node: FDNode): { html: JSX.Element; width: number; height: number } => {
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

export const norneComplex: FlowDiagram = {
    id: "complex",
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
            id: "norne",
            title: "NORNE",
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
        { flow: "electricity-import", from: "windfarm1", to: "norne" },
        { flow: "electricity-import", from: "windfarm2", to: "norne" },
        { flow: "electricity-import", from: "windfarm3", to: "norne" },
        { flow: "electricity-import", from: "power-from-shore", to: "norne" },
        { flow: "fuel", from: "input", to: "norne" },
        { flow: "emissions", from: "norne", to: "emissions-output" },
        { flow: "oil", from: "norne", to: "oil-output" },
        { flow: "electricity-export", from: "norne", to: "electricity-output" },
    ],
};
