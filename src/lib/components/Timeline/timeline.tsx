import React from "react";
import clsx from "clsx";
import { Tooltip, Button, Icon, TextField } from "@equinor/eds-core-react";
import { visibility, visibility_off, calendar } from "@equinor/eds-icons";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useContainerDimensions } from "../../hooks/useContainerDimensions";
import { useMousePosition } from "../../hooks/useMousePosition";
import "./timeline.css";

Icon.add({ visibility, visibility_off, calendar });

dayjs.extend(isBetween);

type TimeFrame = {
    startDate: Dayjs;
    endDate: Dayjs;
};

type TimeFrameItem = {
    timeFrame: TimeFrame;
    width: number;
};

type AxisTick = {
    label?: string;
    position: number;
};

type TimelineProps = {
    timeFrames?: TimeFrame[];
    initialDate: Dayjs | null;
    onDateChange?: (date: Dayjs) => void;
};

type DateEvent = React.ChangeEvent<HTMLInputElement>;

export const Timeline: React.FC<TimelineProps> = (props: TimelineProps): JSX.Element => {
    const [axisTicks, setAxisTicks] = React.useState<AxisTick[]>([]);
    const [frames, setFrames] = React.useState<TimeFrameItem[]>([]);
    const [visible, setVisible] = React.useState<boolean>(true);
    const framesRef = React.useRef<HTMLDivElement>(null);
    const [timelineWidth, setTimelineWidth] = React.useState(0);
    const [currentDate, setCurrentDate] = React.useState<Dayjs | null>(props.initialDate);
    const [currentHoverDate, setCurrentHoverDate] = React.useState<Dayjs | null>(props.initialDate);
    const [sortedTimeFrames, setSortedTimeFrames] = React.useState<TimeFrame[]>([]);
    const size = useContainerDimensions(framesRef);
    const mousePosition = useMousePosition(framesRef);
    const [sliderActive, setSliderActive] = React.useState(false);
    const [resolution, setResolution] = React.useState(0);
    const [hoverSliderVisible, setHoverSliderVisible] = React.useState(false);

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
        setCurrentDate(props.initialDate);
    }, [props.initialDate]);

    React.useEffect(() => {
        if (props.timeFrames && props.timeFrames.length > 0) {
            const sortedFrames = props.timeFrames.sort(
                (a: TimeFrame, b: TimeFrame): number => a.startDate.valueOf() - b.startDate.valueOf()
            );

            setSortedTimeFrames(sortedFrames);
            if (
                !currentDate ||
                currentDate.isBefore(sortedFrames[0].startDate) ||
                currentDate.isAfter(sortedFrames[sortedFrames.length - 1].endDate)
            ) {
                setCurrentDate(sortedFrames[0].startDate);
                setCurrentHoverDate(sortedFrames[0].startDate);
            }
        }
    }, [props.timeFrames, setSortedTimeFrames]);

    React.useEffect(() => {
        if (sortedTimeFrames && sortedTimeFrames.length > 0 && timelineWidth > 0) {
            const startTimestamp = sortedTimeFrames[0].startDate;
            const endTimestamp = sortedTimeFrames[sortedTimeFrames.length - 1].endDate;

            const delta = endTimestamp.diff(startTimestamp);
            const pixelPerMillisecond = timelineWidth / delta;

            const frameItems: TimeFrameItem[] = [];
            for (const sortedFrame of sortedTimeFrames) {
                frameItems.push({
                    timeFrame: sortedFrame,
                    width: sortedFrame.endDate.diff(sortedFrame.startDate) * pixelPerMillisecond,
                });
            }
            setFrames(frameItems);

            const newAxisTicks: AxisTick[] = [];
            const msPerResolutionStep: number[] = [
                60 * 1000, // minute
                60 * 60 * 1000, // hour
                24 * 60 * 60 * 1000, // day
                7 * 24 * 60 * 60 * 1000, // week
                30.5 * 24 * 60 * 60 * 1000, // month
                365 * 24 * 60 * 60 * 1000, // year
                10 * 365 * 24 * 60 * 60 * 1000, // decade
            ];
            const datetimeFormats: string[] = [
                "HH", // minute
                "MMM Do", // hour
                "MMM 'YY", // day
                "MMM 'YY", // week
                "YYYY", // month
                "YYYY", // year
                "YYYY", // decade
            ];
            let resolution = 0;
            let timeFormat = "";
            for (let resolutionIndex = 0; resolutionIndex < msPerResolutionStep.length; resolutionIndex++) {
                if (
                    endTimestamp.diff(startTimestamp).valueOf() / msPerResolutionStep[resolutionIndex] <=
                    timelineWidth
                ) {
                    resolution = msPerResolutionStep[resolutionIndex];
                    timeFormat = datetimeFormats[resolutionIndex];
                    break;
                }
            }
            setResolution(resolution);

            const numLabels = Math.min(5, Math.floor(timelineWidth / 60));
            const numTicks = Math.floor(endTimestamp.diff(startTimestamp).valueOf() / resolution);
            let lastLabel = "";
            let lastLabelIndex = 0;
            for (let i = 0; i < numTicks; i++) {
                const time = dayjs(startTimestamp).valueOf() + i * resolution;
                let label = undefined;
                if (
                    i / Math.ceil(numTicks / numLabels) >= lastLabelIndex &&
                    lastLabel !== dayjs(time).format(timeFormat)
                ) {
                    label = dayjs(time).format(timeFormat);
                    lastLabelIndex++;
                }
                newAxisTicks.push({
                    label: label,
                    position: (time - startTimestamp.valueOf()) * pixelPerMillisecond,
                });
                lastLabel = dayjs(time).format(timeFormat);
            }

            setAxisTicks(newAxisTicks);
        } else {
            setAxisTicks([]);
            setFrames([]);
        }
    }, [timelineWidth, sortedTimeFrames]);

    React.useEffect(() => {
        if (sortedTimeFrames.length > 0 && timelineWidth) {
            const numTicks = Math.floor(
                sortedTimeFrames[sortedTimeFrames.length - 1].endDate.diff(sortedTimeFrames[0].startDate).valueOf() /
                    resolution
            );
            const deltaTick = timelineWidth / numTicks;
            const position = Math.max(0, Math.min(Math.floor(mousePosition.x / deltaTick) * deltaTick, timelineWidth));
            if (hoverSliderVisible) {
                setCurrentHoverDate(
                    dayjs(
                        sortedTimeFrames[0].startDate.valueOf() +
                            (position / timelineWidth) *
                                sortedTimeFrames[sortedTimeFrames.length - 1].endDate.diff(
                                    sortedTimeFrames[0].startDate
                                )
                    )
                );
            }
        }
    }, [mousePosition, resolution, sortedTimeFrames, timelineWidth]);

    const handleMouseMoveEvent = React.useCallback(
        (e: MouseEvent): void => {
            const numTicks = Math.floor(
                sortedTimeFrames[sortedTimeFrames.length - 1].endDate.diff(sortedTimeFrames[0].startDate).valueOf() /
                    resolution
            );
            const deltaTick = timelineWidth / numTicks;
            const left = framesRef.current ? framesRef.current.getBoundingClientRect().left : 0;
            const position = Math.max(0, Math.min(Math.floor((e.pageX - left) / deltaTick) * deltaTick, timelineWidth));
            setCurrentDate(
                dayjs(
                    sortedTimeFrames[0].startDate.valueOf() +
                        (position / timelineWidth) *
                            sortedTimeFrames[sortedTimeFrames.length - 1].endDate.diff(sortedTimeFrames[0].startDate)
                )
            );
        },
        [sortedTimeFrames, framesRef, timelineWidth, resolution, setCurrentDate]
    );

    React.useEffect(() => {
        if (sliderActive) {
            window.addEventListener("mousemove", handleMouseMoveEvent);
        }
        return () => {
            window.removeEventListener("mousemove", handleMouseMoveEvent);
        };
    }, [sliderActive, handleMouseMoveEvent]);

    const handleFrameClick = React.useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            const left = framesRef.current ? framesRef.current.getBoundingClientRect().left : 0;
            const numTicks = Math.floor(
                sortedTimeFrames[sortedTimeFrames.length - 1].endDate.diff(sortedTimeFrames[0].startDate).valueOf() /
                    resolution
            );
            const deltaTick = timelineWidth / numTicks;
            const position = Math.max(0, Math.min(Math.floor((e.pageX - left) / deltaTick) * deltaTick, timelineWidth));
            setCurrentDate(
                dayjs(
                    sortedTimeFrames[0].startDate.valueOf() +
                        (position / timelineWidth) *
                            sortedTimeFrames[sortedTimeFrames.length - 1].endDate.diff(sortedTimeFrames[0].startDate)
                )
            );
        },
        [sortedTimeFrames, framesRef.current, timelineWidth, resolution]
    );

    const handleToggleVisibility = React.useCallback(() => {
        setVisible(!visible);
    }, [visible, setVisible]);

    React.useEffect(() => {
        const handleMouseUp = () => {
            setSliderActive(false);
        };
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [setSliderActive]);

    const handleDateChange = (e: DateEvent) => {
        if (e?.target?.value) setCurrentDate(dayjs(e.target.value));
    };

    React.useEffect(() => {
        if (props.onDateChange && currentDate) {
            props.onDateChange(currentDate);
        }
    }, [currentDate]);

    return (
        <div className="FlowDiagramExplorer__Timeline">
            {currentDate && (
                <div className="FlowDiagramExplorer__Timeline__CurrentSelectionLabel">
                    <TextField
                        id="timeline_date"
                        type="date"
                        value={currentDate.format("YYYY-MM-DD")}
                        onChange={(e: DateEvent) => handleDateChange(e)}
                        min={
                            sortedTimeFrames.length > 0 ? sortedTimeFrames[0].startDate.format("YYYY-MM-DD") : undefined
                        }
                        max={
                            sortedTimeFrames.length > 0
                                ? sortedTimeFrames[sortedTimeFrames.length - 1].endDate.format("YYYY-MM-DD")
                                : undefined
                        }
                    />
                    <Tooltip title={visible ? "Hide timeline" : "Show timeline"} placement="top">
                        <Button
                            className="FlowDiagramExplorer__Timeline__Toggle"
                            variant="ghost_icon"
                            onClick={handleToggleVisibility}
                        >
                            {visible ? (
                                <Icon name="visibility_off" title="Hide" size={16} />
                            ) : (
                                <Icon name="visibility" title="Show" size={16} />
                            )}
                        </Button>
                    </Tooltip>
                </div>
            )}
            <div className="FlowDiagramExplorer__InnerTimeline" style={{ display: visible ? "block" : "none" }}>
                <div
                    className="FlowDiagramExplorer__Timeline__Frames"
                    ref={framesRef}
                    onMouseOver={() => setHoverSliderVisible(true)}
                    onMouseOut={() => setHoverSliderVisible(false)}
                >
                    <div
                        className="FlowDiagramExplorer__Timeline__Slider"
                        style={{
                            left:
                                currentDate && sortedTimeFrames.length > 0
                                    ? (currentDate.diff(sortedTimeFrames[0].startDate) /
                                          sortedTimeFrames[sortedTimeFrames.length - 1].endDate.diff(
                                              sortedTimeFrames[0].startDate
                                          )) *
                                      size.width
                                    : 0,
                        }}
                        onMouseDown={() => setSliderActive(true)}
                    ></div>
                    <div
                        className="FlowDiagramExplorer__Timeline__HoverSlider"
                        style={{
                            left:
                                currentHoverDate && currentHoverDate.valueOf() > 0 && sortedTimeFrames.length > 0
                                    ? (currentHoverDate.diff(sortedTimeFrames[0].startDate) /
                                          sortedTimeFrames[sortedTimeFrames.length - 1].endDate.diff(
                                              sortedTimeFrames[0].startDate
                                          )) *
                                      size.width
                                    : 0,
                            display: hoverSliderVisible ? "block" : "none",
                        }}
                        onMouseUp={(e: React.MouseEvent<HTMLDivElement>) => handleFrameClick(e)}
                    >
                        <div className="FlowDiagramExplorer__Timeline__HoverSlider__Tooltip">
                            {currentHoverDate && currentHoverDate.format("MMMM DD, YYYY")}
                        </div>
                    </div>
                    {frames.map((frame) => (
                        <div
                            key={`frame-${frame.timeFrame.startDate.valueOf()}-${frame.timeFrame.endDate.valueOf()}`}
                            className={clsx(
                                "FlowDiagramExplorer__Timeline__Frame",
                                currentDate &&
                                    currentDate.isBetween(
                                        frame.timeFrame.startDate,
                                        frame.timeFrame.endDate,
                                        null,
                                        "[]"
                                    )
                                    ? "FlowDiagramExplorer__Timeline__Frames--active"
                                    : ""
                            )}
                            style={{ width: frame.width }}
                            onClick={(e: React.MouseEvent<HTMLDivElement>) => handleFrameClick(e)}
                        ></div>
                    ))}
                </div>
                <div className="FlowDiagramExplorer__Timeline__Axis">
                    {axisTicks.map((tick) =>
                        tick.label ? (
                            <div
                                className="FlowDiagramExplorer__Timeline__AxisLabel"
                                style={{ left: tick.position }}
                                key={`axis-label-${tick.position}`}
                            >
                                {tick.label}
                            </div>
                        ) : (
                            <div
                                className="FlowDiagramExplorer__Timeline__AxisTick"
                                style={{ left: tick.position }}
                                key={`axis-tick-${tick.position}`}
                            ></div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};
