/**
 * Copyright (c) 2021- Equinor ASA
 *
 * This source code is licensed under the MPLv2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    MuiThemeProvider,
    createMuiTheme,
    Select,
    MenuItem,
    makeStyles,
} from "@material-ui/core";

import { installation, installation2 } from "./examples/installation";
import CompressorInstallation from "./examples/other-example";
import { ComplexInstallation } from "./examples/complex";
import { FlowDiagram, FlowDiagramExplorer } from "../lib";

const customTheme = createMuiTheme({
    palette: {
        primary: {
            main: "#007079",
        },
    },
});

const useStyles = makeStyles({
    select: {
        color: "#fff",
        "&:before": {
            borderColor: "#fff",
        },
        "&:after": {
            borderColor: "#fff",
        },
    },
    icon: {
        fill: "#fff",
    },
});

const diagramMap: { name: string; diagram: FlowDiagram[] }[] = [
    {
        name: "Default",
        diagram: [installation, installation2],
    },
    {
        name: "Default render example",
        diagram: CompressorInstallation,
    },
    {
        name: "Complex example",
        diagram: [ComplexInstallation],
    },
];

function App(): JSX.Element {
    const classes = useStyles();
    const [diagram, setDiagram] = React.useState<string>("Default");

    const handleDiagramChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        setDiagram(e.target.value as string);
    };

    return (
        <React.StrictMode>
            <MuiThemeProvider theme={customTheme}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" style={{ marginRight: 20 }}>
                            Examples
                        </Typography>
                        <Typography variant="body2" style={{ marginRight: 20 }}>
                            Diagram:
                        </Typography>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={diagram}
                            onChange={handleDiagramChange}
                            className={classes.select}
                        >
                            {diagramMap.map((item) => (
                                <MenuItem value={item.name} key={item.name}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </Toolbar>
                </AppBar>
                <FlowDiagramExplorer
                    flowDiagram={diagramMap.find((el) => el.name === diagram)?.diagram || []}
                    animationsOn={true}
                    width="100%"
                    height="91vh"
                />
            </MuiThemeProvider>
        </React.StrictMode>
    );
}

export default App;
