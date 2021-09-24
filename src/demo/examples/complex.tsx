import { FlowDiagram } from "../../lib/types/diagram";

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
