import React from "react";

import { RenderFunctions } from "lib/types/diagram";
import * as renderLibrary from ".";

const renderInputOutputNode = (): { html: JSX.Element; width: number; height: number } => {
    return {
        html: (
            <div
                style={{
                    width: 0,
                    height: 0,
                }}
            ></div>
        ),
        width: 0,
        height: 100,
    };
};

export const nodeRenderTypes: RenderFunctions = {
    cable: renderLibrary.cableRenderer,
    compressor: renderLibrary.compressorRenderer,
    "compressor-system": renderLibrary.compressorSystemRenderer,
    direct: renderLibrary.directRenderer,
    engine: renderLibrary.engineRenderer,
    "engine-generator-set": renderLibrary.engineGeneratorSetRenderer,
    generator: renderLibrary.generatorRenderer,
    "input-output-node": renderInputOutputNode,
    installation: renderLibrary.installationRenderer,
    pump: renderLibrary.pumpRenderer,
    "pump-system": renderLibrary.pumpSystemRenderer,
    tabulated: renderLibrary.tabulatedRenderer,
    turbine: renderLibrary.turbineRenderer,
    "turbine-generator-set": renderLibrary.turbineGeneratorSetRenderer,
    "wind-turbine": renderLibrary.windTurbineRenderer,
    "wind-turbine-system": renderLibrary.windTurbineSystemRenderer,
};
