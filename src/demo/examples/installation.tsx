import React from "react";

import { FlowDiagram } from "../../lib/types/diagram";
import { windTurbineSystemRenderer, installationRenderer, cableRenderer } from "../../lib/render-library";
import { installationDetails } from "./installation-details";

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
    startDate: "2005-12-18",
    endDate: "2019-05-05",
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
            id: "installation1",
            title: "Installation 1",
            render: installationRenderer,
            subdiagram: installationDetails,
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
        { flow: "electricity-import", fromNode: "windfarm1", toNode: "installation1" },
        { flow: "electricity-import", fromNode: "windfarm2", toNode: "installation1" },
        { flow: "electricity-import", fromNode: "windfarm3", toNode: "installation1" },
        { flow: "electricity-import", fromNode: "power-from-shore", toNode: "installation1" },
        { flow: "fuel", fromNode: "input", toNode: "installation1" },
        { flow: "emissions", fromNode: "installation1", toNode: "emissions-output" },
        { flow: "oil", fromNode: "installation1", toNode: "oil-output" },
        { flow: "electricity-export", fromNode: "installation1", toNode: "electricity-output" },
    ],
};

export const installation2: FlowDiagram = {
    id: "installation",
    title: "World",
    startDate: "2019-05-05",
    endDate: "2020-01-04",
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
            id: "installation1",
            title: "Installation 1",
            render: installationRenderer,
            subdiagram: installationDetails,
        },
        {
            id: "installation2",
            title: "Installation 2",
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
        { flow: "electricity-import", fromNode: "windfarm1", toNode: "installation1" },
        { flow: "electricity-import", fromNode: "windfarm2", toNode: "installation1" },
        { flow: "electricity-import", fromNode: "windfarm1", toNode: "installation2" },
        { flow: "electricity-import", fromNode: "windfarm2", toNode: "installation2" },
        { flow: "fuel", fromNode: "input", toNode: "installation1" },
        { flow: "fuel", fromNode: "input", toNode: "installation2" },
        { flow: "emissions", fromNode: "installation1", toNode: "emissions-output" },
        { flow: "oil", fromNode: "installation1", toNode: "oil-output" },
        { flow: "electricity-export", fromNode: "installation1", toNode: "electricity-output" },
    ],
};
