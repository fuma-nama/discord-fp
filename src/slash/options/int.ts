import { SlashCommandIntegerOption } from "discord.js";
import { makeOption, Option } from "../options";
import { createNumberBuilder, NumberOptionConfig } from "./number";

export type IntOptionConfig<Required extends boolean> =
    NumberOptionConfig<Required>;

export function int<Required extends boolean = true>(
    config: IntOptionConfig<Required>
) {
    return makeOption<number, Required>(config, {
        parse(v) {
            return (v?.value as number) ?? null;
        },
        build(name) {
            return createNumberBuilder(
                new SlashCommandIntegerOption(),
                name,
                config
            );
        },
    });
}
