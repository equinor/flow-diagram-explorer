/**
 * Copyright (c) 2021- Equinor ASA
 *
 * This source code is licensed under the MPLv2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import { Heuristic } from "../lib/utils/node-path-algorithm";
import { DiagramDrawer } from "../lib/utils/diagram-drawer";
import { waterinj } from "./examples/water-injection";
import { Scene } from "../lib/components/Scene";
import { View } from "../lib/components/View";

const { nodes, arrows } = DiagramDrawer({
    diagram: waterinj
});

Heuristic(waterinj);
function App(): JSX.Element {
    return (
        <React.StrictMode>
            <View
                Scene={<Scene nodes={nodes} arrows={arrows} />}
                initialCenterPoint={{ x: 400, y: 250 }}
                width={800}
                height={500}
            />
        </React.StrictMode>
    );
}

export default App;
