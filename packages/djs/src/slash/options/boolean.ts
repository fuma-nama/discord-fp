import { SlashCommandBooleanOption } from "discord.js";
import {
    BaseOptionConfig,
    createBuilder,
    MakeOption,
    makeOption,
} from "./base.js";

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
