import React from "react";
import { FlowDiagramNode } from "../../types/diagram";

import "./template.css";

const createRenderFunction = (
    NodeSymbol: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
): ((node: FlowDiagramNode) => { html: JSX.Element; width: number; height: number }) => {
    return (node: FlowDiagramNode): { html: JSX.Element; width: number; height: number } => ({
        html: (
            <div className="DiagramNode">
                <NodeSymbol className="DiagramSymbol" />
                {node.title}
            </div>
        ),
        width: 250,
        height: 100,
    });
};

export default createRenderFunction;
