import { SlashCommandIntegerOption } from "discord.js";
import { MakeOption, makeOption } from "../option.js";
import { createNumberBuilder, NumberOptionConfig } from "./number.js";

export type IntOptionConfig<Required extends boolean> =
    NumberOptionConfig<Required>;

export function int<Required extends boolean = true>(
    config: IntOptionConfig<Required>
): MakeOption<number, Required> {
    return makeOption(config, {
        parse(v) {
            return (v?.value as number) ?? null;
        },
        build(name, command, context) {
            return createNumberBuilder(
                new SlashCommandIntegerOption(),
                config,
                {
                    name,
                    command,
                    context,
                }
            );
        },
    });
}
