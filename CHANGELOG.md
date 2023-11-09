# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [UNRELEASED] - YYYY-MM-DD

-   [#41](https://github.com/equinor/flow-diagram-explorer/pull/41) - Fixed edge line offsets.

## [1.0.0-alpha8] - 2023-11-09

## Changed

-   [#65](https://github.com/equinor/flow-diagram-explorer/pull/65) - upgrade all packages

## [1.0.0-alpha7] - 2023-11-02

## Changed

-   [#64](https://github.com/equinor/flow-diagram-explorer/pull/64) - Fix typo
-   [#63](https://github.com/equinor/flow-diagram-explorer/pull/63) - Updated release workflow
-   [#62](https://github.com/equinor/flow-diagram-explorer/pull/62) - Uninstalled MUI packages
-   [#61](https://github.com/equinor/flow-diagram-explorer/pull/61) - Replaced all MUI components with EDS

## [1.0.0-alpha6] - 2021-10-05

### Fixed

-   [#31](https://github.com/equinor/flow-diagram-explorer/pull/31) - Fixed inconsistent behaviour at timeline borders.
-   [#32](https://github.com/equinor/flow-diagram-explorer/pull/32) - Fixed width and height issue with timeline container.

### Changed

-   [#32](https://github.com/equinor/flow-diagram-explorer/pull/32) - Adjusted build setup (installed `Storybook`, switched to `rollup`, replaced demo app with stories).
-   [#33](https://github.com/equinor/flow-diagram-explorer/pull/33) - Removed `test` from `prepublish` script (since there are no tests yet).

## [1.0.0-alpha4] - 2021-09-28

### Changed

-   [#25](https://github.com/equinor/flow-diagram-explorer/pull/25) - Changed class names to be unique for FlowDiagramExplorer.
-   [#26](https://github.com/equinor/flow-diagram-explorer/pull/26) - Adjusted flow diagram input to be pure JSON and moved flow styles and node render functions to additional properties of `FlowDiagramExplorer`.
-   [#28](https://github.com/equinor/flow-diagram-explorer/pull/28) - Implemented dynamic min zoom (dependent on map size).

### Fixed

-   [#27](https://github.com/equinor/flow-diagram-explorer/pull/27) - Fixed animation artifacts by setting browser performance flags.

## [1.0.0-alpha3] - 2021-09-01

-   [#13](https://github.com/equinor/flow-diagram-explorer/pull/12) - Set declaration files to be created and `css` and `svg` files to be copied on build.

## [1.0.0-alpha2] - 2021-08-24

### Changed

-   [#12](https://github.com/equinor/flow-diagram-explorer/pull/12) - Removed `preinstall` script (when installing with npm >= 7.\*, use `--legacy-peer-deps`).

## [1.0.0-alpha1] - 2021-08-24

### Changed

-   [#11](https://github.com/equinor/flow-diagram-explorer/pull/11) - Renamed `from` to `fromNode` and `to` to `toNode` in `FlowDiagramEdge`. Also replaced `diagram-drawer.tsx` with `diagram-drawer-advanced.tsx` and removed the latter.

## [1.0.0-alpha] - 2021-08-18

### Added

-   [#3](https://github.com/equinor/flow-diagram-explorer/pull/3) - Setup of build environment.
-   [#5](https://github.com/equinor/flow-diagram-explorer/pull/5) - Implemented automatic diagram layout (nodes and arrows), paning & zooming, minimap, rendering library (oil and gas) and node and flow interaction (click events)
-   [#7](https://github.com/equinor/flow-diagram-explorer/pull/7) - Implemented timeline component.
-   [#10](https://github.com/equinor/flow-diagram-explorer/pull/10) - Implemented smooth zoom when doubleclicking on view.

### Changed

-   [#9](https://github.com/equinor/flow-diagram-explorer/pull/9) - Refactored code and improved edge layout algorithm (preventing edges from being on top of each other or behind nodes, repeating flow names).

### Fixed

-   [#4](https://github.com/equinor/flow-diagram-explorer/pull/4) - Fixed security issues, missing dependencies and adjusted actions according to `master` -> `main` convention.
