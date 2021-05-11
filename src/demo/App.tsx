/**
 * Copyright (c) 2021- Equinor ASA
 *
 * This source code is licensed under the MPLv2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import { FlowDiagramParser } from "../lib/utils/node-path-algorithm";
import { DiagramDrawer } from "../lib/utils/diagram-drawer";
import { waterinj } from "./examples/water-injection";
import { Scene } from "../lib/components/Scene";

const nodePaths = FlowDiagramParser(waterinj);
const { nodes, arrows } = DiagramDrawer({
  diagram: waterinj,
  nodePaths: nodePaths
});

function App(): JSX.Element {
  return (
    <React.StrictMode>
      <div className="App">
        <Scene nodes={nodes} />
      </div>
    </React.StrictMode>
  );
}

export default App;
