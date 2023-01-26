import { SlashCommandBooleanOption } from "discord.js";
import { MakeOption, makeOption } from "../option";
import { BaseOptionConfig, createBuilder } from "./base";

export type BooleanOptionConfig<Required extends boolean> =
    BaseOptionConfig<Required>;

export function boolean<Required extends boolean = true>(
    config: BooleanOptionConfig<Required>
): MakeOption<boolean, Required> {
    return makeOption(config, {
        build(name) {
            return createBuilder(new SlashCommandBooleanOption(), name, config);
        },
        parse(value) {
            return (value?.value as boolean) ?? null;
        },
    });
}
