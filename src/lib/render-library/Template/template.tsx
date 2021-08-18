import React from "react";
import { FlowDiagramNode } from "../../types/diagram";

import "./template.css";

const createRenderFunction = (
    NodeSymbol: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
): ((node: FlowDiagramNode) => { html: JSX.Element; width: number; height: number }) => {
    return (node: FlowDiagramNode): { html: JSX.Element; width: number; height: number } => ({
        html: (
            <div className="RenderLibrary__DiagramNode">
                <NodeSymbol className="RenderLibrary__DiagramSymbol" />
                {node.title}
            </div>
        ),
        width: 220,
        height: 140,
    });
};

export default createRenderFunction;
