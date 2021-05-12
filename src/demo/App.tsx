/**
 * Copyright (c) 2021- Equinor ASA
 *
 * This source code is licensed under the MPLv2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import { LinearOptimizer } from "../lib/utils/node-path-algorithm";
import { DiagramDrawer } from "../lib/utils/diagram-drawer";
import { waterinj } from "./examples/water-injection";
import { Scene } from "../lib/components/Scene";
import { View } from "../lib/components/View";

const { nodes, arrows } = DiagramDrawer({
    diagram: waterinj
});

LinearOptimizer(waterinj);
function App(): JSX.Element {
    return (
        <React.StrictMode>
            <View
                Scene={<Scene nodes={nodes} arrows={arrows} />}
                initialCenterPoint={{ x: 200, y: 500 }}
                width={1800}
                height={1000}
            />
        </React.StrictMode>
    );
}

export default App;
