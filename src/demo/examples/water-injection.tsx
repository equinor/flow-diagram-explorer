import React from "react";
import { FlowDiagram, FDNode } from "../../lib/types/nodes";

const renderNode = (node: FDNode): { html: JSX.Element; width: number; height: number } => {
    return {
        html: (
            <div
                style={{
                    position: "relative",
                    width: 20,
                    height: 20,
                    marginTop: -10,
                    marginLeft: -10,
                    backgroundColor: "black",
                    borderRadius: 10
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        left: "-50px"
                    }}
                >
                    {node.title}
                </div>
            </div>
        ),
        width: 20,
        height: 20
    };
};

export const waterinj: FlowDiagram = {
    title: "waterinjection",
    nodes: [
        {
            id: "input",
            title: "Input",
            render: renderNode
        },
        {
            id: "1",
            title: "1",
            icon: "pump"
        },
        {
            id: "2",
            title: "2",
            icon: "pump"
        },
        {
            id: "3",
            title: "3",
            icon: "pump"
        },
        {
            id: "4",
            title: "4",
            icon: "pump"
        },
        {
            id: "5",
            title: "5",
            icon: "pump"
        },
        {
            id: "6",
            title: "6",
            icon: "other"
        },
        {
            id: "7",
            title: "7",
            icon: "other"
        },
        {
            id: "8",
            title: "8",
            icon: "other"
        },
        {
            id: "9",
            title: "9",
            icon: "other"
        },
        {
            id: "10",
            title: "10",
            icon: "other"
        }
    ],
    flows: [
        { id: "emissions", label: "Emissions", style: { color: "#666", strokeStyle: "4 2" } },
        { id: "fuel", label: "Fuel", style: { color: "green", strokeStyle: "0" } }
    ],
    edges: [
        { flow: "fuel", from: "input", to: "1" },
        { flow: "fuel", from: "1", to: "5" },
        { flow: "emissions", from: "input", to: "2" },
        { flow: "emissions", from: "input", to: "3" },
        { flow: "emissions", from: "input", to: "4" },
        { flow: "emissions", from: "1", to: "5" },
        { flow: "emissions", from: "2", to: "6" },
        { flow: "emissions", from: "3", to: "7" },
        { flow: "emissions", from: "4", to: "8" },
        { flow: "emissions", from: "5", to: "9" },
        { flow: "emissions", from: "6", to: "10" },
        { flow: "emissions", from: "7", to: "10" },
        { flow: "emissions", from: "10", to: "9" }
    ]
};
