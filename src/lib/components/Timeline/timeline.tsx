import React from "react";
import { Tooltip, Button, Icon } from "@equinor/eds-core-react";
import { chevron_down, chevron_up } from "@equinor/eds-icons";
import dayjs, { Dayjs } from "dayjs";

import { useContainerDimensions } from "../../hooks/useContainerDimensions";

import "./timeline.css";

Icon.add({ chevron_down, chevron_up });

type TimeFrame = {
    id: string;
    fromDate: Dayjs;
    toDate: Dayjs;
};

type TimeFrameItem = {
    timeFrame: TimeFrame;
    width: number;
};

type AxisLabel = {
    label: string;
    position: number;
};

type TimelineProps = {
    timeFrames?: TimeFrame[];
};

export const Timeline: React.FC<TimelineProps> = (props: TimelineProps): JSX.Element => {
    const [axisLabels, setAxisLabels] = React.useState<AxisLabel[]>([]);
    const [frames, setFrames] = React.useState<TimeFrameItem[]>([]);
    const [activeFrame, setActiveFrame] = React.useState<TimeFrame | null>(null);
    const [visible, setVisible] = React.useState<boolean>(true);
    const framesRef = React.useRef<HTMLDivElement>(null);
    const [timelineWidth, setTimelineWidth] = React.useState(0);
    const size = useContainerDimensions(framesRef);

    React.useEffect(() => {
        if (visible) {
            setTimelineWidth(size.width);
        }
    }, [size]);

    React.useEffect(() => {
        if (visible && framesRef.current) {
            setTimelineWidth(framesRef.current.offsetWidth);
        }
    }, [visible]);

    React.useEffect(() => {
        if (props.timeFrames) {
            const sortedFrames = props.timeFrames.sort(
                (a: TimeFrame, b: TimeFrame): number => a.fromDate.valueOf() - b.fromDate.valueOf()
            );

            const startTimestamp = sortedFrames[0].fromDate;
            const endTimestamp = sortedFrames[sortedFrames.length - 1].toDate;

            const delta = endTimestamp.diff(startTimestamp);
            const pixelPerMillisecond = timelineWidth / delta;

            const frameItems: TimeFrameItem[] = [];
            for (const sortedFrame of sortedFrames) {
                frameItems.push({
                    timeFrame: sortedFrame,
                    width: sortedFrame.toDate.diff(sortedFrame.fromDate) * pixelPerMillisecond,
                });
            }
            setFrames(frameItems);

            const newAxisLabels: AxisLabel[] = [];
            const numLabels = Math.min(6, Math.floor(timelineWidth / 50));
            for (let i = 0; i < numLabels; i++) {
                const time = startTimestamp.valueOf() + (i * delta) / (numLabels - 1);
                newAxisLabels.push({
                    label: dayjs(time).format("MMM 'YY"),
                    position: (time - startTimestamp.valueOf()) * pixelPerMillisecond,
                });
            }
            setAxisLabels(newAxisLabels);
        } else {
            setAxisLabels([]);
            setFrames([]);
        }
    }, [props.timeFrames, timelineWidth]);

    const handleFrameClick = React.useCallback((timeFrame: TimeFrame) => {
        setActiveFrame(timeFrame);
    }, []);

    const handleToggleVisibility = React.useCallback(() => {
        setVisible(!visible);
    }, [visible, setVisible]);

    return (
        <div className="Timeline">
            {activeFrame && (
                <div className="LabelContainer">
                    <div>
                        <span className="LabelText">
                            {activeFrame.fromDate.format("MMMM DD, YYYY")} -{" "}
                            {activeFrame.toDate.format("MMMM DD, YYYY")}
                        </span>
                        <Tooltip title={visible ? "Hide timeline" : "Show timeline"} placement="top">
                            <Button variant="ghost_icon" onClick={handleToggleVisibility}>
                                {visible ? (
                                    <Icon name="chevron_down" title="Hide" size={16} />
                                ) : (
                                    <Icon name="chevron_up" title="Show" size={16} />
                                )}
                            </Button>
                        </Tooltip>
                    </div>
                </div>
            )}
            <div className="InnerTimeline" style={{ display: visible ? "block" : "none" }}>
                <div className="Frames" ref={framesRef}>
                    {frames.map((frame) => (
                        <Tooltip
                            title={`${frame.timeFrame.fromDate.format(
                                "MMMM DD, YYYY"
                            )} - ${frame.timeFrame.toDate.format("MMMM DD, YYYY")}`}
                            placement="top"
                        >
                            <div
                                className={activeFrame && activeFrame.id === frame.timeFrame.id ? "active" : ""}
                                style={{ width: frame.width }}
                                onClick={() => handleFrameClick(frame.timeFrame)}
                            ></div>
                        </Tooltip>
                    ))}
                </div>
                <div className="Axis">
                    {axisLabels.map((label) => (
                        <div className="Label" style={{ left: label.position }}>
                            {label.label}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
