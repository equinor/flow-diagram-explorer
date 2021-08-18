![GitHub](https://img.shields.io/github/license/equinor/flow-diagram-explorer)
[![Build Status](https://github.com/equinor/flow-diagram-explorer/workflows/flow-diagram-explorer/badge.svg)](https://github.com/equinor/flow-diagram-explorer/actions?query=branch%3Amaster)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/equinor/flow-diagram-explorer.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/equinor/flow-diagram-explorer/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/equinor/flow-diagram-explorer.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/equinor/flow-diagram-explorer/context:javascript)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier%20%28JavaScript%29-ff69b4.svg)](https://github.com/prettier/prettier)

# flow-diagram-explorer

| :gear: [Live demo application](https://equinor.github.io/flow-diagram-explorer/)

## Introduction

`flow-diagram-explorer` is a React component library providing layouting, visualization and navigation for flow diagrams.

## Installation

The easiest way of installing `flow-diagram-explorer` is to run

```
npm i @equinor/flow-diagram-explorer
```

Find package on npm: https://www.npmjs.com/package/@equinor/flow-diagram-explorer

## Usage

### Simple usage example

Import the `flow-diagram-explorer` in your project:

```
import { FlowDiagram, FlowDiagramExplorer} from "@equinor/flow-diagram-explorer";
```

Create a new diagram:

```
const myDiagram: FlowDiagram = {
    id: "MyDiagram",
    title: "My Diagram",
    nodes: [
        {
            id: "node1",
            title: "Node 1",
        },
        {
            id: "node2",
            title: "Node 2",
        },
    ],
    flows: [
        {
            id: "flow",
            label: "Flow",
            style: { strokeColor: "blue" }
        }
    ],
    edges: [
        {
            flow: "flow",
            from: "node1",
            to: "node2"
        }
    ]
}
```

Include the `flow-diagram-explorer` with your new diagram:

```
<FlowDiagramExplorer
    flowDiagram={myDiagram}
    animationsOn={true}
    width="100%"
    height="95vh"
>
```

## Contributing

If you want to build and develop yourself, you should fork and clone the repository.

Then install all npm dependencies.

```
npm install
```

Write new custom code in `src/lib/`. The demo application is located in the `src/demo/` directory. You can start the demo
app by running `npm start`. In order to add new custom diagram examples, move the diagram file to the `src/demo/examples/` folder and
import and add the diagram in the `App.tsx` file to the `diagramMap` list.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
