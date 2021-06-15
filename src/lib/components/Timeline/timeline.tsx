import React from "react";
import { Tooltip, Button, Icon } from "@equinor/eds-core-react";
import { chevron_down, chevron_up, calendar } from "@equinor/eds-icons";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import DayjsUtils from "@date-io/dayjs";

import { useContainerDimensions } from "../../hooks/useContainerDimensions";

import "./timeline.css";
import clsx from "clsx";
import { useMousePosition } from "../../hooks/useMousePosition";

Icon.add({ chevron_down, chevron_up, calendar });

dayjs.extend(isBetween);

type TimeFrame = {
    id: string;
    fromDate: Dayjs;
    toDate: Dayjs;
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
};

export const Timeline: React.FC<TimelineProps> = (props: TimelineProps): JSX.Element => {
    const [axisTicks, setAxisTicks] = React.useState<AxisTick[]>([]);
    const [frames, setFrames] = React.useState<TimeFrameItem[]>([]);
    const [visible, setVisible] = React.useState<boolean>(true);
    const framesRef = React.useRef<HTMLDivElement>(null);
    const [timelineWidth, setTimelineWidth] = React.useState(0);
    const [currentDate, setCurrentDate] = React.useState<Dayjs | undefined>(
        props.timeFrames && props.timeFrames.length > 0 ? props.timeFrames[0].fromDate : undefined
    );
    const [currentHoverDate, setCurrentHoverDate] = React.useState<Dayjs | undefined>(
        props.timeFrames && props.timeFrames.length > 0 ? props.timeFrames[0].fromDate : undefined
    );
    const [sortedTimeFrames, setSortedTimeFrames] = React.useState<TimeFrame[]>([]);
    const size = useContainerDimensions(framesRef);
    const mousePosition = useMousePosition();
    const [sliderActive, setSliderActive] = React.useState(false);
    const [resolution, setResolution] = React.useState(0);

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

            setSortedTimeFrames(sortedFrames);
            setCurrentDate(sortedFrames[0].fromDate);
        }
    }, [props.timeFrames]);

    React.useEffect(() => {
        if (props.timeFrames && timelineWidth > 0) {
            const startTimestamp = sortedTimeFrames[0].fromDate;
            const endTimestamp = sortedTimeFrames[sortedTimeFrames.length - 1].toDate;

            const delta = endTimestamp.diff(startTimestamp);
            const pixelPerMillisecond = timelineWidth / delta;

            const frameItems: TimeFrameItem[] = [];
            for (const sortedFrame of sortedTimeFrames) {
                frameItems.push({
                    timeFrame: sortedFrame,
                    width: sortedFrame.toDate.diff(sortedFrame.fromDate) * pixelPerMillisecond,
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
            let resolution = 0;
            for (let resolutionIndex = 0; resolutionIndex < msPerResolutionStep.length; resolutionIndex++) {
                if (
                    endTimestamp.diff(startTimestamp).valueOf() / msPerResolutionStep[resolutionIndex] <=
                    timelineWidth
                ) {
                    resolution = msPerResolutionStep[resolutionIndex];
                    break;
                }
            }
            setResolution(resolution);

            const numLabels = Math.min(6, Math.floor(timelineWidth / 50));
            const numTicks = Math.floor(endTimestamp.diff(startTimestamp).valueOf() / resolution);
            //const deltaTick = timelineWidth / (numTicks - 1);
            for (let i = 0; i < numTicks; i++) {
                const time = dayjs(startTimestamp).valueOf() + i * resolution;
                newAxisTicks.push({
                    label: i % Math.floor(numTicks / numLabels) === 0 ? dayjs(time).format("MMM 'YY") : undefined,
                    position: (time - startTimestamp.valueOf()) * pixelPerMillisecond,
                });
            }

            setAxisTicks(newAxisTicks);
        } else {
            setAxisTicks([]);
            setFrames([]);
        }
    }, [props.timeFrames, timelineWidth]);

    React.useEffect(() => {
        if (sortedTimeFrames.length > 0 && timelineWidth) {
            const numTicks = Math.floor(
                sortedTimeFrames[sortedTimeFrames.length - 1].toDate.diff(sortedTimeFrames[0].fromDate).valueOf() /
                    resolution
            );
            const deltaTick = timelineWidth / numTicks;
            const left = framesRef.current ? framesRef.current.getBoundingClientRect().left : 0;
            const position = Math.max(
                0,
                Math.min(Math.floor((mousePosition.x - left) / deltaTick) * deltaTick, timelineWidth)
            );
            setCurrentHoverDate(
                dayjs(
                    sortedTimeFrames[0].fromDate.valueOf() +
                        (position / timelineWidth) *
                            sortedTimeFrames[sortedTimeFrames.length - 1].toDate.diff(sortedTimeFrames[0].fromDate)
                )
            );
            if (sliderActive) {
                setCurrentDate(
                    dayjs(
                        sortedTimeFrames[0].fromDate.valueOf() +
                            (position / timelineWidth) *
                                sortedTimeFrames[sortedTimeFrames.length - 1].toDate.diff(sortedTimeFrames[0].fromDate)
                    )
                );
            }
        }
    }, [mousePosition, resolution, sortedTimeFrames, timelineWidth]);

    const handleFrameClick = React.useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            const left = framesRef.current ? framesRef.current.getBoundingClientRect().left : 0;
            const numTicks = Math.floor(
                sortedTimeFrames[sortedTimeFrames.length - 1].toDate.diff(sortedTimeFrames[0].fromDate).valueOf() /
                    resolution
            );
            const deltaTick = timelineWidth / numTicks;
            const position = Math.max(0, Math.min(Math.floor((e.pageX - left) / deltaTick) * deltaTick, timelineWidth));
            setCurrentDate(
                dayjs(
                    sortedTimeFrames[0].fromDate.valueOf() +
                        (position / timelineWidth) *
                            sortedTimeFrames[sortedTimeFrames.length - 1].toDate.diff(sortedTimeFrames[0].fromDate)
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
    });

    const handleDateChange = React.useCallback(
        (date: MaterialUiPickersDate) => {
            if (date) {
                setCurrentDate(date);
            }
        },
        [setCurrentDate]
    );

    return (
        <div className="Timeline">
            {currentDate && (
                <div className="CurrentSelectionLabel">
                    <Icon name="calendar" title="Hide" size={16} />
                    <MuiPickersUtilsProvider utils={DayjsUtils}>
                        <DatePicker
                            disableToolbar
                            variant="inline"
                            value={currentDate}
                            onChange={handleDateChange}
                            format="MMMM DD, YYYY"
                            maxDate={
                                sortedTimeFrames.length > 0
                                    ? sortedTimeFrames[sortedTimeFrames.length - 1].toDate
                                    : undefined
                            }
                            minDate={sortedTimeFrames.length > 0 ? sortedTimeFrames[0].fromDate : undefined}
                            className="DatePicker"
                            InputProps={{
                                disableUnderline: true,
                            }}
                        />
                    </MuiPickersUtilsProvider>
                    <Tooltip title={visible ? "Hide timeline" : "Show timeline"} placement="top">
                        <Button className="Toggle" variant="ghost_icon" onClick={handleToggleVisibility}>
                            {visible ? (
                                <Icon name="chevron_down" title="Hide" size={16} />
                            ) : (
                                <Icon name="chevron_up" title="Show" size={16} />
                            )}
                        </Button>
                    </Tooltip>
                </div>
            )}
            <div className="InnerTimeline" style={{ display: visible ? "block" : "none" }}>
                <div className="Frames" ref={framesRef}>
                    <div
                        className="Slider"
                        style={{
                            left:
                                currentDate && sortedTimeFrames.length > 0
                                    ? (currentDate.diff(sortedTimeFrames[0].fromDate) /
                                          sortedTimeFrames[sortedTimeFrames.length - 1].toDate.diff(
                                              sortedTimeFrames[0].fromDate
                                          )) *
                                      size.width
                                    : 0,
                        }}
                        onMouseDown={() => setSliderActive(true)}
                    ></div>
                    {frames.map((frame) => (
                        <Tooltip
                            title={currentHoverDate && currentHoverDate.format("MMMM DD, YYYY")}
                            placement="top"
                            key={frame.timeFrame.fromDate.valueOf()}
                        >
                            <div
                                className={clsx(
                                    "Frame",
                                    currentDate &&
                                        currentDate.isBetween(
                                            frame.timeFrame.fromDate,
                                            frame.timeFrame.toDate,
                                            null,
                                            "[]"
                                        )
                                        ? "active"
                                        : ""
                                )}
                                style={{ width: frame.width }}
                                onClick={(e: React.MouseEvent<HTMLDivElement>) => handleFrameClick(e)}
                            ></div>
                        </Tooltip>
                    ))}
                </div>
                <div className="Axis">
                    {axisTicks.map((tick) =>
                        tick.label ? (
                            <div className="Label" style={{ left: tick.position }}>
                                {tick.label}
                            </div>
                        ) : (
                            <div className="Tick" style={{ left: tick.position }}></div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};
