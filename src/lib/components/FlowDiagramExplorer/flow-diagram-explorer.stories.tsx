// Button.stories.ts | Button.stories.tsx

import React from "react";
import { Story, Meta } from "@storybook/react";

import FlowDiagramExplorer, { FlowDiagramExplorerProps } from "./flow-diagram-explorer";

export default {
    component: FlowDiagramExplorer,
    title: "FlowDiagramExplorer",
} as Meta;

import { FlowDiagram, FlowDiagramNode } from "../../types/diagram";
import { nodeRenderTypes } from "../../render-library/";
import { defaultDiagramConfig } from "../NodeActionHandler/node-action-handler";

const Template: Story<FlowDiagramExplorerProps> = (props) => <FlowDiagramExplorer {...props} />;

export const Simple = Template.bind({});

const compressor: FlowDiagramNode = {
    id: "compressor1",
    title: "Compressor 1",
    icon: "compressor",
};
const compressorSystem: FlowDiagramNode = {
    id: "compressor-system1",
    title: "Compressor system 1",
    icon: "compressor-system",
    subdiagram: [
        {
            id: "compressor-system1",
            title: "Compressor system 1",
            nodes: [
                { id: "system1-comp1", title: "Compressor 1", icon: "compressor" },
                { id: "system1-comp2", title: "Compressor 2", icon: "compressor" },
            ],
            edges: [],
            flows: [],
            startDate: "2018-01-01",
            endDate: "2020-01-01",
        },
        {
            id: "compressor-system1",
            title: "Compressor system 1",
            nodes: [
                { id: "system1-comp1", title: "Compressor 1", icon: "compressor" },
                { id: "system1-comp2", title: "Compressor 2", icon: "compressor" },
                { id: "system1-comp3", title: "Compressor 3", icon: "compressor" },
            ],
            edges: [],
            flows: [],
            startDate: "2020-01-01",
            endDate: "2021-06-29",
        },
    ],
};
const simpleInstallation: FlowDiagram[] = [
    {
        id: "installation-diagram-1",
        title: "Installation1",
        nodes: [{ id: "fuel-node" }, compressorSystem],
        edges: [{ fromNode: "fuel-node", toNode: "compressor-system1", flow: "fuel-flow" }],
        flows: [{ id: "fuel-flow", label: "Fuel" }],
        startDate: "2018-01-01",
        endDate: "2019-01-01",
    },
    {
        id: "installation-diagram-1",
        title: "Installation1",
        nodes: [{ id: "fuel-node" }, compressorSystem, compressor],
        edges: [
            { fromNode: "fuel-node", toNode: "compressor-system1", flow: "fuel-flow" },
            { fromNode: "fuel-node", toNode: "compressor1", flow: "fuel-flow" },
        ],
        flows: [{ id: "fuel-flow", label: "Fuel" }],
        startDate: "2019-01-01",
        endDate: "2021-06-29",
    },
];

Simple.args = {
    flowDiagram: simpleInstallation,
    renderFunctions: nodeRenderTypes,
    width: "100%",
    height: "600px",
    diagramConfig: defaultDiagramConfig,
};

export const Basic = Template.bind({});

const basicInstallation: FlowDiagram = {
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
            id: "windfarm1",
            title: "Wind farm 1",
            type: "wind-turbine-system",
        },
        {
            id: "windfarm2",
            title: "Wind farm 2",
            type: "wind-turbine-system",
        },
        {
            id: "windfarm3",
            title: "Wind farm 3",
            type: "wind-turbine-system",
        },
        {
            id: "power-from-shore",
            title: "Power from shore",
            type: "cable",
        },
        {
            id: "installation1",
            title: "Installation 1",
            type: "installation",
            subdiagram: {
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
            },
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
            type: "electricity-import",
        },
        {
            id: "electricity-export",
            label: "Electricity export",
            type: "electricity-export",
        },
        { id: "emissions", label: "Emissions", type: "emissions" },
        { id: "fuel", label: "Fuel", type: "fuel" },
        { id: "oil", label: "Oil", type: "oil" },
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

const basicInstallation2: FlowDiagram = {
    id: "installation",
    title: "World",
    startDate: "2019-05-06",
    endDate: "2020-01-04",
    nodes: [
        {
            id: "input",
            title: "Input",
            type: "input-output-node",
        },
        {
            id: "windfarm1",
            title: "Wind farm 1",
            type: "wind-turbine-system",
        },
        {
            id: "windfarm2",
            title: "Wind farm 2",
            type: "wind-turbine-system",
        },
        {
            id: "installation1",
            title: "Installation 1",
            type: "installation",
            subdiagram: {
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
            },
        },
        {
            id: "installation2",
            title: "Installation 2",
            type: "installation",
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
            type: "electricity-import",
        },
        {
            id: "electricity-export",
            label: "Electricity export",
            type: "electricity-export",
        },
        { id: "emissions", label: "Emissions", type: "emissions" },
        { id: "fuel", label: "Fuel", type: "fuel" },
        { id: "oil", label: "Oil", type: "oil" },
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

Basic.args = {
    flowDiagram: [basicInstallation, basicInstallation2],
    renderFunctions: nodeRenderTypes,
    width: "100%",
    height: "600px",
    diagramConfig: defaultDiagramConfig,
};

export const Complex = Template.bind({});

const complexInstallation: FlowDiagram = {
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
            type: "electricity-import",
        },
        {
            id: "electricity-export",
            label: "Electricity export",
            type: "electricity-export",
        },
        { id: "electricity", label: "Electricity", type: "electricity" },
        { id: "emissions", label: "Emissions", type: "emissions" },
        { id: "fuel", label: "Fuel", type: "fuel" },
        { id: "oil", label: "Oil", type: "oil" },
        { id: "air", label: "Air", type: "air" },
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

Complex.args = {
    flowDiagram: [complexInstallation],
    renderFunctions: nodeRenderTypes,
    width: "100%",
    height: "600px",
    diagramConfig: defaultDiagramConfig,
};
