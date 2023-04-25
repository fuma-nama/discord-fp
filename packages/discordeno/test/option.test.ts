import { User, UserToggles } from "discordeno/transformers";
import { UserOptionValue, options } from "../src/options/index.js";
import { describe, it, expect } from "vitest";

const mock_user: User = {
    discriminator: "discriminator",
    username: "Dev",
    id: BigInt("1"),
    toggles: new UserToggles(0),
};

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

        const value: UserOptionValue = {
            value: mock_user,
        };

        expect(o.parse(value)).toBe(value);
    });
});
