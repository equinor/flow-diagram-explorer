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
import { usePrevious } from "../../hooks/usePrevious";

type MapPropsType = {
    Scene: React.ReactElement;
    ActionHandler: React.ReactElement;
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
    const [centerPoint, setCenterPoint] = React.useState({
        x: sceneSize.width / 2,
        y: sceneSize.height / 2,
    });
    const [boundaryBox, setBoundaryBox] = React.useState<Size>({
        width: sceneSize.width,
        height: sceneSize.height,
    });
    const { scale, setNewScale } = useZoom({ ref: mapRef });
    const previousId = usePrevious(id);

    React.useEffect(() => {
        setBoundaryBox({
            width: sceneSize.width,
            height: sceneSize.height,
        });
    }, [sceneSize]);

    React.useEffect(() => {
        const newBoundaryBox = {
            width: sceneSize.width,
            height: sceneSize.height,
        };
        setBoundaryBox(newBoundaryBox);
        setViewCenterPoint({
            x: newBoundaryBox.width / 2,
            y: newBoundaryBox.height / 2,
        });
        setCenterPoint({
            x: newBoundaryBox.width / 2,
            y: newBoundaryBox.height / 2,
        });
        setNewScale(1);
    }, [id]);

    const handleViewCenterPointChange = React.useCallback(
        (newCenterPoint: Point) => {
            setCenterPoint(newCenterPoint);
        },
        [setCenterPoint]
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
                    setCenterPoint(centerPoint);
                },
                [MapActionType.ZoomOut]: () => {
                    const newScale = Math.max(0.5, scale - 0.1);
                    setNewScale(newScale);
                    setViewCenterPoint(centerPoint);
                    setCenterPoint({
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
                    setCenterPoint({
                        x: boundaryBox.width / 2,
                        y: boundaryBox.height / 2,
                    });
                },
            };
            actions[action]();
        },
        [setViewCenterPoint, setCenterPoint, scale, centerPoint, setNewScale, size, boundaryBox]
    );

    return (
        <div ref={mapRef} className="Map" style={{ width: width, height: height }}>
            {id !== previousId ? (
                <></>
            ) : (
                <View
                    initialCenterPoint={viewCenterPoint}
                    width={width}
                    height={height}
                    Scene={React.cloneElement(props.ActionHandler, {}, Scene)}
                    boundaryBox={boundaryBox}
                    onCenterPointChange={handleViewCenterPointChange}
                    scale={scale}
                    backgroundColor={config.backgroundColor}
                />
            )}
            <Minimap
                initialCenterPoint={centerPoint}
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
