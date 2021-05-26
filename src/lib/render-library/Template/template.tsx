import React from "react";
import { FDNode } from "../../types/nodes";

const createRenderFunction = (image: string): (node: FDNode) => { html: JSX.Element; width: number; height: number } => {
    return (node: FDNode): { html: JSX.Element; width: number; height: number } => ({
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
                <img src={image} alt="" style={{ marginRight: 16, width: 64, strokeWidth: 10 }} />
                {node.title}
            </div>
        ),
        width: 250,
        height: 100,
    });
};

export default createRenderFunction;
