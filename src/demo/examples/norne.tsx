import React from "react";
import { FlowDiagram, FDNode } from "../../lib/types/nodes";

import windfarm from "./windfarm.png";
import powerplant from "./powerplant.png";
import oilrig from "./oilrig.png";

const renderInputOutputNode = (node: FDNode): { html: JSX.Element; width: number; height: number } => {
    return {
        html: (
            <div
                style={{
                    width: 0,
                    height: 0,
                }}
            >
            </div>
        ),
        width: 0,
        height: 100
    };
};

const renderWindFarmNode = (node: FDNode): { html: JSX.Element; width: number; height: number } => {
    return {
        html: (
            <div
                style={{
                    padding: 24,
                    width: 202,
                    height: 52,
                    marginTop: -50,
                    marginLeft: -125,
                    backgroundColor: "#fff",
                    border: "2px #545454 solid",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <img src={windfarm} alt="" style={{ marginRight: 16 }} />
                {node.title}
            </div>
        ),
        width: 250,
        height: 100
    };
};

const renderPowerPlantNode = (node: FDNode): { html: JSX.Element; width: number; height: number } => {
    return {
        html: (
            <div
                style={{
                    padding: 24,
                    width: 202,
                    height: 52,
                    marginTop: -50,
                    marginLeft: -125,
                    backgroundColor: "#fff",
                    border: "2px #545454 solid",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <img src={powerplant} alt="" style={{ marginRight: 16 }} />
                {node.title}
            </div>
        ),
        width: 250,
        height: 100
    };
};

const renderOilrigNode = (node: FDNode): { html: JSX.Element; width: number; height: number } => {
    return {
        html: (
            <div
                style={{
                    padding: 24,
                    width: 202,
                    height: 52,
                    marginTop: -50,
                    marginLeft: -125,
                    backgroundColor: "#fff",
                    border: "2px #545454 solid",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <img src={oilrig} alt="" style={{ marginRight: 16 }} />
                {node.title}
            </div>
        ),
        width: 250,
        height: 100
    };
};


export const norne: FlowDiagram = {
    title: "World",
    nodes: [
        {
            id: "input",
            title: "Input",
            render: renderInputOutputNode
        },
        {
            id: "windfarm",
            title: "Wind farm",
            render: renderWindFarmNode
        },
        {
            id: "power-from-shore",
            title: "Power from shore",
            render: renderPowerPlantNode
        },
        {
            id: "norne",
            title: "NORNE",
            render: renderOilrigNode,
        },
        {
            id: "electricity-output",
            title: "Output",
            render: renderInputOutputNode
        },
        {
            id: "emissions-output",
            title: "Output",
            render: renderInputOutputNode
        }
    ],
    flows: [
        { id: "electricity-import", label: "Electricity import", style: { strokeColor: "#A7B0B6", strokeStyle: "6 2" } },
        { id: "electricity-export", label: "Electricity export", style: { strokeColor: "#A7B0B6", strokeStyle: "6 2" } },
        { id: "emissions", label: "Emissions", style: { strokeColor: "#A7B0B6", strokeStyle: "0" } },
        { id: "fuel", label: "Fuel", style: { strokeColor: "#A7B0B6", strokeStyle: "0" } }
    ],
    edges: [
        { flow: "electricity-import", from: "windfarm", to: "norne" },
        { flow: "electricity-import", from: "power-from-shore", to: "norne" },
        { flow: "fuel", from: "input", to: "norne" },
        { flow: "electricity-export", from: "norne", to: "electricity-output" },
        { flow: "emissions", from: "norne", to: "emissions-output" }
    ]
};
