import { RenderFunctions } from "lib/types/diagram";
import { cableRenderer } from "./Cable";
import { compressorRenderer } from "./Compressor";
import { compressorSystemRenderer } from "./CompressorSystem";
import { directRenderer } from "./Direct";
import { engineRenderer } from "./Engine";
import { engineGeneratorSetRenderer } from "./EngineGeneratorSet";
import { generatorRenderer } from "./Generator";
import { installationRenderer } from "./Installation";
import { pumpRenderer } from "./Pump";
import { pumpSystemRenderer } from "./PumpSystem";
import { tabulatedRenderer } from "./Tabulated";
import { turbineRenderer } from "./Turbine";
import { turbineGeneratorSetRenderer } from "./TurbineGeneratorSet";
import { windTurbineRenderer } from "./WindTurbine";
import { windTurbineSystemRenderer } from "./WindTurbineSystem";
import { renderInputOutputNode } from "./inputOutputNodeRenderer";

const nodeRenderTypes: RenderFunctions = {
    cable: cableRenderer,
    compressor: compressorRenderer,
    "compressor-system": compressorSystemRenderer,
    direct: directRenderer,
    engine: engineRenderer,
    "engine-generator-set": engineGeneratorSetRenderer,
    generator: generatorRenderer,
    "input-output-node": renderInputOutputNode,
    installation: installationRenderer,
    pump: pumpRenderer,
    "pump-system": pumpSystemRenderer,
    tabulated: tabulatedRenderer,
    turbine: turbineRenderer,
    "turbine-generator-set": turbineGeneratorSetRenderer,
    "wind-turbine": windTurbineRenderer,
    "wind-turbine-system": windTurbineSystemRenderer,
};

export {
    cableRenderer,
    compressorRenderer,
    compressorSystemRenderer,
    directRenderer,
    engineRenderer,
    engineGeneratorSetRenderer,
    generatorRenderer,
    installationRenderer,
    pumpRenderer,
    pumpSystemRenderer,
    tabulatedRenderer,
    turbineRenderer,
    turbineGeneratorSetRenderer,
    windTurbineRenderer,
    windTurbineSystemRenderer,
    nodeRenderTypes,
};
