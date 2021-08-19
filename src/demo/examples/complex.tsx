import React from "react";

import { FlowDiagram } from "../../lib/types/diagram";
import {
    windTurbineSystemRenderer,
    turbineGeneratorSetRenderer,
    installationRenderer,
    cableRenderer,
} from "../../lib/render-library";
import { engineGeneratorSetRenderer } from "../../lib/render-library/EngineGeneratorSet/engine-generator-set";
import { pumpSystemRenderer } from "../../lib/render-library/PumpSystem/pump-system";
import { directRenderer } from "../../lib/render-library/Direct/direct";
import { tabulatedRenderer } from "../../lib/render-library/Tabulated/tabulated";
import { compressorSystemRenderer } from "../../lib/render-library/CompressorSystem/compressor-system";

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
            render: renderInputOutputNode,
        },
        {
            id: "turbine-generator-set",
            title: "Turbine generator set",
            render: turbineGeneratorSetRenderer,
        },
        {
            id: "engine-generator-set",
            title: "Engine generator set",
            render: engineGeneratorSetRenderer,
        },
        {
            id: "windfarm",
            title: "Wind farm",
            render: windTurbineSystemRenderer,
        },
        {
            id: "power-from-shore",
            title: "Power from shore",
            render: cableRenderer,
        },
        {
            id: "pump-system",
            title: "Pump system",
            render: pumpSystemRenderer,
        },
        {
            id: "compressor-system",
            title: "Compressor system",
            render: compressorSystemRenderer,
        },
        {
            id: "installation",
            title: "Installation",
            render: installationRenderer,
        },
        {
            id: "direct",
            title: "Direct",
            render: directRenderer,
        },
        {
            id: "tabulated",
            title: "Tabulated",
            render: tabulatedRenderer,
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
