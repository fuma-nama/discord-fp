import { SlashCommandStringOption } from "discord.js";
import { MakeOption, makeOption } from "../options";
import {
    AutoCompleteOptionConfig,
    BaseOptionConfig,
    ChoicesOptionConfig,
    createBuilder,
    buildChoices,
} from "./base";

export type StringOptionConfig<Required extends boolean> =
    BaseOptionConfig<Required> &
        ChoicesOptionConfig<string> &
        AutoCompleteOptionConfig & {
            minLen?: number;
            maxLen?: number;
        };

export function string<Required extends boolean = true>(
    config: StringOptionConfig<Required>
): MakeOption<string, Required> {
    return makeOption(config, {
        parse(v) {
            return (v?.value as string) ?? null;
        },
        build(name: string) {
            const builder = createBuilder(
                new SlashCommandStringOption(),
                name,
                config
            );

            if (config.minLen != null) builder.setMinLength(config.minLen);
            if (config.maxLen != null) builder.setMaxLength(config.maxLen);

            return builder
                .setChoices(...buildChoices(config))
                .setAutocomplete(config.autoComplete != null);
        },
    });
}
