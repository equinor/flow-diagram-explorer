const checkIfInProductionMode = (): boolean => {
    return process.env["NODE_ENV"] === "production";
};

export class DebugConsole {
    static log(msg: string): void {
        if (!checkIfInProductionMode()) {
            // eslint-disable-next-line no-console
            console.log(msg);
        }
    }

    static warn(msg: string): void {
        if (!checkIfInProductionMode()) {
            // eslint-disable-next-line no-console
            console.warn(msg);
        }
    }

    static error(msg: string): void {
        if (!checkIfInProductionMode()) {
            // eslint-disable-next-line no-console
            console.error(msg);
        }
    }
}
