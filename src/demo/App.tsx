/**
 * Copyright (c) 2021- Equinor ASA
 *
 * This source code is licensed under the MPLv2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import { DiagramDrawer } from "../lib/utils/diagram-drawer";
import { waterinj } from "./examples/water-injection";
import { Scene } from "../lib/components/Scene";
import { Map } from "../lib/components/Map";

const { nodes, arrows, size } = DiagramDrawer({
    flowDiagram: waterinj
});

function App(): JSX.Element {
    return (
        <React.StrictMode>
            <Map
                Scene={<Scene nodes={nodes} arrows={arrows} size={size} />}
                initialCenterPoint={{ x: 400, y: 250 }}
                width="100%"
                height="800px"
                sceneSize={size}
                margin={200}
            />
        </React.StrictMode>
    );
}

export default App;
