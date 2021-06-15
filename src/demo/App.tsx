/**
 * Copyright (c) 2021- Equinor ASA
 *
 * This source code is licensed under the MPLv2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import { installation } from "./examples/installation";
import { installationDetails } from "./examples/waterinj";
import { FlowDiagramExplorer } from "../lib";

function App(): JSX.Element {
    const [diagram, setDiagram] = React.useState(installation);

    const handleNodeClick = (nodeId: string) => {
        if (nodeId === "installation") {
            setDiagram(installationDetails);
        }
    };

    const handleDiagramChange = (title: string) => {
        if (title === "Installation") {
            setDiagram(installationDetails);
        } else {
            setDiagram(installation);
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
