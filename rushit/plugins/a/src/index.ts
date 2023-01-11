import {BasePlugin} from "@jimp/plugin-base"

declare module "@jimp/plugin-base" {
    interface Base {
        nxt: (a: number, b: number) => number;
    }
}

export const plugA: BasePlugin<void> = (_, cls) => {
    cls.prototype.nxt = (a: number,b: number) => a+b;
    return cls;
}