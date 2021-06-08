import React from "react";
import { View } from "../View";
import { Minimap } from "../Minimap";
import { MapActions, MapActionType } from "../MapActions";
import { Point } from "../../types/point";
import { Size } from "../../types/dimensions";
import { useContainerDimensions } from "../../hooks/useContainerDimensions";
import { useZoom } from "../../hooks/useZoom";
import { usePrevious } from "../../hooks/usePrevious";
import { pointScale } from "../../utils/geometry";

import "./map.css";
type MapPropsType = {
    Scene: React.ReactElement;
    sceneSize: Size;
    width: number | string;
    height: number | string;
    margin: number;
    id: string;
};

export const Map: React.FC<MapPropsType> = (props: MapPropsType): JSX.Element => {
    const { sceneSize, Scene, width, height, margin, id } = props;
    const mapRef = React.useRef<HTMLDivElement>(null);
    const size = useContainerDimensions(mapRef);
    const [mapScale, setMapScale] = React.useState(1);
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
    const { scale, resetScale } = useZoom({ ref: mapRef });

    const previousScale = usePrevious<number>(scale) || 1;

    React.useEffect(() => {
        if (scale !== previousScale) {
            const scaleDelta = scale - previousScale;
            setMapScale(mapScale + scaleDelta);
        }
    }, [scale, previousScale]);

    React.useEffect(() => {
        setBoundaryBox({
            width: sceneSize.width,
            height: sceneSize.height,
        });
        resetScale();
    }, [sceneSize]);

    React.useEffect(() => {
        setViewCenterPoint({
            x: (boundaryBox.width / 2) * mapScale,
            y: (boundaryBox.height / 2) * mapScale,
        });
        setMinimapCenterPoint({
            x: (boundaryBox.width / 2) * mapScale,
            y: (boundaryBox.height / 2) * mapScale,
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
            if (action === MapActionType.ZoomIn) {
                const newMapScale = Math.min(3, mapScale + 0.1);
                setMapScale(newMapScale);
                console.log(centerPoint);
                setViewCenterPoint(pointScale(pointScale(centerPoint, mapScale), 1 / newMapScale));
                setMinimapCenterPoint(centerPoint);
            } else if (action === MapActionType.ZoomOut) {
                const newMapScale = Math.max(0.5, mapScale - 0.1);
                setMapScale(newMapScale);
                setViewCenterPoint(pointScale(pointScale(centerPoint, mapScale), 1 / newMapScale));
                setMinimapCenterPoint({
                    x: (boundaryBox.width / 2) * newMapScale,
                    y: (boundaryBox.height / 2) * newMapScale,
                });
            } else if (action === MapActionType.CenterView) {
                setViewCenterPoint({ x: (boundaryBox.width / 2) * mapScale, y: (boundaryBox.height / 2) * mapScale });
                setMinimapCenterPoint({
                    x: (boundaryBox.width / 2) * mapScale,
                    y: (boundaryBox.height / 2) * mapScale,
                });
            }
        },
        [setViewCenterPoint, setMinimapCenterPoint, mapScale, centerPoint]
    );

    return (
        <div ref={mapRef} className="Map" style={{ width: width, height: height }}>
            <View
                initialCenterPoint={viewCenterPoint}
                width={width}
                height={height}
                Scene={Scene}
                boundaryBox={boundaryBox}
                margin={margin}
                onCenterPointChange={handleViewCenterPointChange}
                scale={mapScale}
                id={id}
            />
            <Minimap
                initialCenterPoint={minimapCenterPoint}
                scaling={0.1}
                viewSize={size}
                boundaryBox={boundaryBox}
                Scene={Scene}
                margin={margin}
                onCenterPointChange={handleMinimapCenterPointChange}
                scale={mapScale}
            />
            <MapActions onActionTriggered={handleActionTriggered} />
        </div>
    );
};
