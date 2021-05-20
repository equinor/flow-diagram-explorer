import React from "react";
import { View } from "../View";
import { Minimap } from "../Minimap";
import { Point } from "../../types/point";
import { Size } from "../../types/dimensions";
import { useContainerDimensions } from "../../hooks/useContainerDimensions";

import "./map.css";

type MapPropsType = {
    initialCenterPoint: Point;
    Scene: React.ReactElement;
    sceneSize: Size;
    width: number | string;
    height: number | string;
    margin: number;
};

export const Map: React.FC<MapPropsType> = (props: MapPropsType): JSX.Element => {
    const { initialCenterPoint, sceneSize, Scene, width, height, margin } = props;
    const mapRef = React.useRef<HTMLDivElement>(null);
    const size = useContainerDimensions(mapRef);
    const [viewCenterPoint, setViewCenterPoint] = React.useState(initialCenterPoint);
    const [minimapCenterPoint, setMinimapCenterPoint] = React.useState(initialCenterPoint);

    const boundaryBox = {
        width: Math.max(sceneSize.width + 2 * margin, size.width),
        height: Math.max(sceneSize.height + 2 * margin, size.height)
    };

    React.useEffect(() => {
        const adjustedViewCenterPoint = {
            x: Math.min(Math.max(viewCenterPoint.x, size.width / 2), boundaryBox.width - size.width / 2),
            y: Math.min(Math.max(viewCenterPoint.y, size.height / 2), boundaryBox.height - size.height / 2)
        };
        setViewCenterPoint(adjustedViewCenterPoint);

        const adjustedMinimapCenterPoint = {
            x: Math.min(Math.max(minimapCenterPoint.x, size.width / 2), boundaryBox.width - size.width / 2),
            y: Math.min(Math.max(minimapCenterPoint.y, size.height / 2), boundaryBox.height - size.height / 2)
        };
        setMinimapCenterPoint(adjustedMinimapCenterPoint);
    }, [size]);

    const handleViewCenterPointChange = (newCenterPoint: Point) => {
        setMinimapCenterPoint(newCenterPoint);
    };

    const handleMinimapCenterPointChange = (newCenterPoint: Point) => {
        setViewCenterPoint(newCenterPoint);
    };

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
            />
            <Minimap
                initialCenterPoint={minimapCenterPoint}
                scaling={0.1}
                viewSize={size}
                boundaryBox={boundaryBox}
                Scene={Scene}
                margin={margin}
                onCenterPointChange={handleMinimapCenterPointChange}
            />
        </div>
    );
};