import { SlashCommandBooleanOption } from "discord.js";
import { makeOption } from "../options";
import { BaseOptionConfig, createBuilder } from "./base";

export type BooleanOptionConfig<Required extends boolean> =
    BaseOptionConfig<Required>;

export function boolean<Required extends boolean = true>(
    config: BooleanOptionConfig<Required>
) {
    return makeOption<boolean, Required>(config, {
        build(name) {
            return createBuilder(new SlashCommandBooleanOption(), name, config);
        },
        parse(value) {
            return (value.value as boolean) ?? null;
        },
    });
}
