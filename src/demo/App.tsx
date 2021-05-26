/**
 * Copyright (c) 2021- Equinor ASA
 *
 * This source code is licensed under the MPLv2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import { norne } from "./examples/norne";
import { waterinj } from "./examples/waterinj";
import FlowDiagramExplorer from "../lib";

function App(): JSX.Element {
    const [diagram, setDiagram] = React.useState(norne);

    const handleNodeClick = (nodeId: string) => {
        if (nodeId === "norne") {
            setDiagram(waterinj);
        }
    };

    const handleDiagramChange = (title: string) => {
        if (title === "norne") {
            setDiagram(waterinj);
        } else {
            setDiagram(norne);
        }
    };

    return (
        <React.StrictMode>
            <FlowDiagramExplorer
                flowDiagram={diagram}
                onNodeClick={handleNodeClick}
                onDiagramChange={handleDiagramChange}
            />
        </React.StrictMode>
    );
}

export default App;
