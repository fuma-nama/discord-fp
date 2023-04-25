import { options } from "../src/options/index.js";
import { describe, it, expect } from "vitest";
import { user } from "./mock-discord.js";

describe("options", () => {
    it("return 10", () => {
        const o = options.int({
            description: "Hello world",
        });

        expect(o.parse(10)).toBe(10);
    });

    it("It should return false", () => {
        const o = options.boolean({
            description: "Hello world",
        });

        expect(o.parse(false)).toBe(false);
    });

    it("return text", () => {
        const o = options.string({
            description: "Hello world",
        });

        expect(o.parse("Text")).toBeTypeOf("string");
    });

    it("return the user", () => {
        const o = options.user({
            description: "Hello world",
        });

        const value = {
            value: user,
        };

        expect(o.parse(value)).toBe(value);
    });
});
