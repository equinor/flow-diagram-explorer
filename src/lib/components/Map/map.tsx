import React from "react";
import { View } from "../View";
import { Minimap } from "../Minimap";
import { MapActions, MapActionType } from "../MapActions";
import { Point } from "../../types/point";
import { Size } from "../../types/size";
import { useContainerDimensions } from "../../hooks/useContainerDimensions";
import { useZoom } from "../../hooks/useZoom";
import { DiagramConfig } from "lib/types/diagram";

import "./map.css";

type MapPropsType = {
    Scene: React.ReactElement;
    sceneSize: Size;
    width: number | string;
    height: number | string;
    id: string;
    config: DiagramConfig;
};

export const Map: React.FC<MapPropsType> = (props) => {
    const { sceneSize, Scene, width, height, id, config } = props;
    const mapRef = React.useRef<HTMLDivElement>(null);
    const size = useContainerDimensions(mapRef);
    const [viewCenterPoint, setViewCenterPoint] = React.useState({ x: sceneSize.width / 2, y: sceneSize.height / 2 });
    const [minimapCenterPoint, setMinimapCenterPoint] = React.useState({
        x: sceneSize.width / 2,
        y: sceneSize.height / 2,
    });
    const [centerPoint, setCenterPoint] = React.useState({
        x: sceneSize.width / 2,
        y: sceneSize.height / 2,
    });
    const [boundaryBox, setBoundaryBox] = React.useState<Size>({
        width: sceneSize.width,
        height: sceneSize.height,
    });
    const { scale, setNewScale } = useZoom({ ref: mapRef });

    React.useEffect(() => {
        setBoundaryBox({
            width: sceneSize.width,
            height: sceneSize.height,
        });
        setNewScale(1);
    }, [sceneSize]);

    React.useEffect(() => {
        setViewCenterPoint({
            x: (boundaryBox.width / 2) * scale,
            y: (boundaryBox.height / 2) * scale,
        });
        setMinimapCenterPoint({
            x: (boundaryBox.width / 2) * scale,
            y: (boundaryBox.height / 2) * scale,
        });
    }, [size, boundaryBox]);

    const handleViewCenterPointChange = React.useCallback(
        (newCenterPoint: Point) => {
            setMinimapCenterPoint(newCenterPoint);
            setCenterPoint(newCenterPoint);
        },
        [setMinimapCenterPoint, setCenterPoint]
    );

    const handleMinimapCenterPointChange = React.useCallback(
        (newCenterPoint: Point) => {
            setViewCenterPoint(newCenterPoint);
            setCenterPoint(newCenterPoint);
        },
        [setViewCenterPoint, setCenterPoint]
    );

    const handleActionTriggered = React.useCallback(
        (action: MapActionType): void => {
            const actions: { [key: string]: () => void } = {
                [MapActionType.ZoomIn]: () => {
                    const newScale = Math.min(3, scale + 0.1);
                    setNewScale(newScale);
                    setViewCenterPoint(centerPoint);
                    setMinimapCenterPoint(centerPoint);
                },
                [MapActionType.ZoomOut]: () => {
                    const newScale = Math.max(0.5, scale - 0.1);
                    setNewScale(newScale);
                    setViewCenterPoint(centerPoint);
                    setMinimapCenterPoint({
                        x: (boundaryBox.width / 2) * newScale,
                        y: (boundaryBox.height / 2) * newScale,
                    });
                },
                [MapActionType.CenterView]: () => {
                    const mapSceneRatio = Math.min(size.height / boundaryBox.height, size.width / boundaryBox.width);
                    const mapSceneRatioAdjustedTo10Percent = Math.floor(mapSceneRatio / 0.1) * 0.1;
                    const mapSceneRatioWithMargin = mapSceneRatioAdjustedTo10Percent - 0.1;
                    const newScale = Math.min(Math.max(mapSceneRatioWithMargin, 0.5), scale);
                    setNewScale(newScale);
                    setViewCenterPoint({
                        x: boundaryBox.width / 2,
                        y: boundaryBox.height / 2,
                    });
                    setMinimapCenterPoint({
                        x: boundaryBox.width / 2,
                        y: boundaryBox.height / 2,
                    });
                },
            };
            actions[action]();
        },
        [setViewCenterPoint, setMinimapCenterPoint, scale, centerPoint, setNewScale, size, boundaryBox]
    );

    return (
        <div ref={mapRef} className="Map" style={{ width: width, height: height }}>
            <View
                initialCenterPoint={viewCenterPoint}
                width={width}
                height={height}
                Scene={Scene}
                boundaryBox={boundaryBox}
                onCenterPointChange={handleViewCenterPointChange}
                scale={scale}
                id={id}
                backgroundColor={config.backgroundColor}
            />
            <Minimap
                initialCenterPoint={minimapCenterPoint}
                viewSize={size}
                boundaryBox={boundaryBox}
                Scene={Scene}
                onCenterPointChange={handleMinimapCenterPointChange}
                scale={scale}
            />
            <MapActions onActionTriggered={handleActionTriggered} />
        </div>
    );
};
