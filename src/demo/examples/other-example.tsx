import { FlowDiagram, FlowDiagramNode } from "../../lib";

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
const installation: FlowDiagram[] = [
    {
        id: "installation-diagram-1",
        title: "Installation1",
        nodes: [{ id: "fuel-node" }, compressorSystem],
        edges: [{ from: "fuel-node", to: "compressor-system1", flow: "fuel-flow" }],
        flows: [{ id: "fuel-flow", label: "Fuel", style: {} }],
        startDate: "2018-01-01",
        endDate: "2019-01-01",
    },
    {
        id: "installation-diagram-1",
        title: "Installation1",
        nodes: [{ id: "fuel-node" }, compressorSystem, compressor],
        edges: [
            { from: "fuel-node", to: "compressor-system1", flow: "fuel-flow" },
            { from: "fuel-node", to: "compressor1", flow: "fuel-flow" },
        ],
        flows: [{ id: "fuel-flow", label: "Fuel", style: {} }],
        startDate: "2019-01-01",
        endDate: "2021-06-29",
    },
];

export default installation;
