import React from "react";
import { View } from "../View";
import { Minimap } from "../Minimap";
import { MapActions, MapActionType } from "../MapActions";
import { Point } from "../../types/point";
import { Size } from "../../types/dimensions";
import { useContainerDimensions } from "../../hooks/useContainerDimensions";
import { useZoom } from "../../hooks/useZoom";
import { usePrevious } from "../../hooks/usePrevious";

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

    React.useLayoutEffect(() => {
        setBoundaryBox({
            width: sceneSize.width,
            height: sceneSize.height,
        });
        resetScale();
    }, [sceneSize]);

    React.useEffect(() => {
        const adjustedViewCenterPoint = {
            x: Math.min(Math.max(viewCenterPoint.x, size.width / 2), boundaryBox.width - size.width / 2),
            y: Math.min(Math.max(viewCenterPoint.y, size.height / 2), boundaryBox.height - size.height / 2),
        };
        setViewCenterPoint(adjustedViewCenterPoint);

        const adjustedMinimapCenterPoint = {
            x: Math.min(Math.max(minimapCenterPoint.x, size.width / 2), boundaryBox.width - size.width / 2),
            y: Math.min(Math.max(minimapCenterPoint.y, size.height / 2), boundaryBox.height - size.height / 2),
        };
        setMinimapCenterPoint(adjustedMinimapCenterPoint);
    }, [size]);

    const handleViewCenterPointChange = React.useCallback(
        (newCenterPoint: Point) => {
            setMinimapCenterPoint(newCenterPoint);
        },
        [setMinimapCenterPoint]
    );

    const handleMinimapCenterPointChange = React.useCallback(
        (newCenterPoint: Point) => {
            setViewCenterPoint(newCenterPoint);
        },
        [setViewCenterPoint]
    );

    const handleActionTriggered = React.useCallback(
        (action: MapActionType): void => {
            if (action === MapActionType.ZoomIn) {
                setMapScale(Math.min(3, mapScale + 0.1));
            } else if (action === MapActionType.ZoomOut) {
                setMapScale(Math.max(0.5, mapScale - 0.1));
            } else if (action === MapActionType.CenterView) {
                setViewCenterPoint({ x: (boundaryBox.width / 2) * scale, y: (boundaryBox.height / 2) * scale });
                setMinimapCenterPoint({ x: (boundaryBox.width / 2) * scale, y: (boundaryBox.height / 2) * scale });
            }
        },
        [setViewCenterPoint, setMinimapCenterPoint, mapScale]
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
