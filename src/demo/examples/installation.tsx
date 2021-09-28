import { FlowDiagram } from "../../lib/types/diagram";
import { installationDetails } from "./installation-details";

export const installation: FlowDiagram = {
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
            subdiagram: installationDetails,
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

export const installation2: FlowDiagram = {
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
            subdiagram: installationDetails,
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
