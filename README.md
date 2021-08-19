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

## Quick start

1. Import the `flow-diagram-explorer` in your project:

```typescript
import { FlowDiagram, FlowDiagramExplorer } from "@equinor/flow-diagram-explorer";
```

2. Create a new diagram:

```typescript
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
            style: { strokeColor: "blue" },
        },
    ],
    edges: [
        {
            flow: "flow",
            fromNode: "node1",
            toNode: "node2",
        },
    ],
};
```

3. Include the `flow-diagram-explorer` with your new diagram:

```typescript
<FlowDiagramExplorer
    flowDiagram={myDiagram}
    animationsOn={true}
    width="100%"
    height="95vh"
>
```

## Advanced usage

### Flow diagram options

A flow diagram consists of a unique `id`, a `title` and a list for each `nodes`, `flows` and `edges`.

#### `id`

The `id` is used to identify the diagram, e.g. in click, timeline or level change events. It should be unique but should be shared by diagram objects that represent the status of a diagram in different time intervals.

#### `title`

The title is used in the breadcrumb menu on the top left of the diagram explorer to identify the current location in the diagram structure.

#### `flows`

Flow objects define the different flows within a flow diagram (e.g. _emissions_ or _electricity_). A flow object consists of an `id`, a `label` and a `style` object. The `id` is used as a reference for the diagram's edges and the `label` is shown for each edge (e.g. `Emission`). The `style` object can be used to apply custom a appearance to all edges connected to the particular flow. The properties of the `style`object are:

```typescript
style: {
    strokeColor: string; // Color of the edges' stroke
    strokewidth: number; // Width of the edges' stroke
    arrowHeadSize: number; // Size (in px) of the arrows at the end of the flow's edges
    strokeStyle: string; // A series of numbers separated by whitespaces defining the length of strokes and spaces (see here for examples https://www.w3schools.com/graphics/svg_stroking.asp - NOTE: use whitespaces instead of commas)
}
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
