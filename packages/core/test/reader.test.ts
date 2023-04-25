import { resolve } from "path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { readNode } from "../src/loader/reader";
import { Node } from "../dist";
import { loadNode } from "../src/loader/loader";

describe("file loader", () => {
    it("read node", () => {
        const path = resolve("./test/fixture/command.ts");

        expect(readNode(path)).toBeDefined();
    });

    it("load node", () => {
        const value: Node = {
            loader: {
                load() {},
            },
            type: "file",
            name: "test",
            path: "./test.ts",
        };

        const mock = vi
            .fn()
            .mockImplementation(readNode)
            .mockReturnValue(value);

        expect(loadNode(mock("./test.ts"), {}));
    });
});
