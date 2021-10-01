import { FlowDiagram } from "../../lib/types/diagram";
import { installationDetails } from "./installation-details";

export const installation: FlowDiagram = {
    edges: [
        {
            flow: "fuel-flow",
            fromNode: "fuel-input",
            toNode: "installation-NOR",
        },
        {
            flow: "emission-flow",
            fromNode: "installation-NOR",
            toNode: "emission-output",
        },
    ],
    endDate: "1901-01-01T00:00:00Z",
    flows: [
        {
            id: "fuel-flow",
            label: "Fuel",
        },
        {
            id: "emission-flow",
            label: "Emissions",
        },
    ],
    id: "area",
    nodes: [
        {
            id: "fuel-input",
        },
        {
            id: "installation-NOR",
            subdiagram: [
                {
                    edges: [
                        {
                            flow: "fuel-flow",
                            fromNode: "fuel-input",
                            toNode: "NOR-generator-set-NORgenset",
                        },
                        {
                            flow: "fuel-flow",
                            fromNode: "fuel-input",
                            toNode: "NOR-consumer-flare",
                        },
                        {
                            flow: "fuel-flow",
                            fromNode: "fuel-input",
                            toNode: "NOR-consumer-gasexport",
                        },
                        {
                            flow: "electricity-flow",
                            fromNode: "NOR-generator-set-NORgenset",
                            toNode: "NOR-consumer-fixedprodloads",
                        },
                        {
                            flow: "electricity-flow",
                            fromNode: "NOR-generator-set-NORgenset",
                            toNode: "NOR-consumer-deh_skuld",
                        },
                        {
                            flow: "electricity-flow",
                            fromNode: "NOR-generator-set-NORgenset",
                            toNode: "NOR-consumer-waterinj",
                        },
                        {
                            flow: "emission-flow",
                            fromNode: "NOR-generator-set-NORgenset",
                            toNode: "emission-output",
                        },
                        {
                            flow: "emission-flow",
                            fromNode: "NOR-consumer-flare",
                            toNode: "emission-output",
                        },
                        {
                            flow: "emission-flow",
                            fromNode: "NOR-consumer-gasexport",
                            toNode: "emission-output",
                        },
                    ],
                    endDate: "1901-01-01T00:00:00Z",
                    flows: [
                        {
                            id: "fuel-flow",
                            label: "Fuel",
                        },
                        {
                            id: "electricity-flow",
                            label: "electricity",
                        },
                        {
                            id: "emission-flow",
                            label: "Emissions",
                        },
                    ],
                    id: "NOR",
                    nodes: [
                        {
                            id: "fuel-input",
                        },
                        {
                            id: "NOR-generator-set-NORgenset",
                            title: "NORgenset",
                            type: "generator",
                        },
                        {
                            id: "NOR-consumer-flare",
                            subdiagram: [
                                {
                                    edges: [],
                                    endDate: "1901-01-01T00:00:00Z",
                                    flows: [],
                                    id: "NOR-consumer-flare",
                                    nodes: [
                                        {
                                            id: "NOR-consumer-flare-1900-01-01 00:00:00",
                                            title: "DIRECT",
                                            type: "DIRECT",
                                        },
                                    ],
                                    startDate: "1900-01-01T00:00:00Z",
                                    title: "flare",
                                },
                            ],
                            title: "flare",
                            type: "fuel",
                        },
                        {
                            id: "NOR-consumer-gasexport",
                            subdiagram: [
                                {
                                    edges: [],
                                    endDate: "1901-01-01T00:00:00Z",
                                    flows: [],
                                    id: "NOR-consumer-gasexport",
                                    nodes: [
                                        {
                                            id: "NOR-consumer-gasexport-1900-01-01 00:00:00",
                                            title: "COMPRESSOR",
                                            type: "COMPRESSOR",
                                        },
                                    ],
                                    startDate: "1900-01-01T00:00:00Z",
                                    title: "gasexport",
                                },
                            ],
                            title: "gasexport",
                            type: "fuel",
                        },
                        {
                            id: "NOR-consumer-fixedprodloads",
                            subdiagram: [
                                {
                                    edges: [],
                                    endDate: "1901-01-01T00:00:00Z",
                                    flows: [],
                                    id: "NOR-consumer-fixedprodloads",
                                    nodes: [
                                        {
                                            id: "NOR-consumer-fixedprodloads-1900-01-01 00:00:00",
                                            title: "DIRECT",
                                            type: "DIRECT",
                                        },
                                    ],
                                    startDate: "1900-01-01T00:00:00Z",
                                    title: "fixedprodloads",
                                },
                            ],
                            title: "fixedprodloads",
                            type: "electricity",
                        },
                        {
                            id: "NOR-consumer-deh_skuld",
                            subdiagram: [
                                {
                                    edges: [],
                                    endDate: "1901-01-01T00:00:00Z",
                                    flows: [],
                                    id: "NOR-consumer-deh_skuld",
                                    nodes: [
                                        {
                                            id: "NOR-consumer-deh_skuld-1900-01-01 00:00:00",
                                            title: "DIRECT",
                                            type: "DIRECT",
                                        },
                                    ],
                                    startDate: "1900-01-01T00:00:00Z",
                                    title: "deh_skuld",
                                },
                            ],
                            title: "deh_skuld",
                            type: "electricity",
                        },
                        {
                            id: "NOR-consumer-waterinj",
                            subdiagram: [
                                {
                                    edges: [],
                                    endDate: "1901-01-01T00:00:00Z",
                                    flows: [],
                                    id: "NOR-consumer-waterinj",
                                    nodes: [
                                        {
                                            id: "NOR-consumer-waterinj-1900-01-01 00:00:00",
                                            title: "PUMP_SYSTEM",
                                            type: "PUMP_SYSTEM",
                                        },
                                    ],
                                    startDate: "1900-01-01T00:00:00Z",
                                    title: "waterinj",
                                },
                            ],
                            title: "waterinj",
                            type: "electricity",
                        },
                        {
                            id: "emission-output",
                        },
                    ],
                    startDate: "1900-01-01T00:00:00Z",
                    title: "NOR",
                },
            ],
            title: "NOR",
            type: "installation",
        },
        {
            id: "emission-output",
        },
    ],
    startDate: "1900-01-01T00:00:00Z",
    title: "Area",
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
