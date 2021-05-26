/**
 * Copyright (c) 2021- Equinor ASA
 *
 * This source code is licensed under the MPLv2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("Renders", () => {
    render(<App />);
    expect(true).toBeTruthy();
});
