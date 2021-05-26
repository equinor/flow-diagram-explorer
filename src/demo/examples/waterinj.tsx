import React from "react";
import { FlowDiagram, FDNode } from "../../lib/types/nodes";

import pump from "./pump.png";

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

const renderPumpNode = (node: FDNode): { html: JSX.Element; width: number; height: number } => {
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
                    alignItems: "center",
                }}
            >
                <img src={pump} alt="" style={{ marginRight: 16 }} />
                {node.title}
            </div>
        ),
        width: 250,
        height: 100,
    };
};

export const waterinj: FlowDiagram = {
    title: "NORNE",
    nodes: [
        {
            id: "input",
            title: "Input",
            render: renderInputOutputNode,
        },
        {
            id: "pump1",
            title: "Pump 1",
            render: renderPumpNode,
        },
        {
            id: "pump2",
            title: "Pump 2",
            render: renderPumpNode,
        },
        {
            id: "pump3",
            title: "Pump 3",
            render: renderPumpNode,
        },
        {
            id: "pump4",
            title: "Pump 4",
            render: renderPumpNode,
        },
    ],
    flows: [{ id: "something", label: "Something", style: { strokeColor: "#A7B0B6", strokeStyle: "0" } }],
    edges: [
        { flow: "something", from: "input", to: "pump1" },
        { flow: "something", from: "input", to: "pump2" },
        { flow: "something", from: "input", to: "pump3" },
        { flow: "something", from: "input", to: "pump4" },
    ],
};
