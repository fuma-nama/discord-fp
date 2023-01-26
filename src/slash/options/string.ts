import { SlashCommandStringOption } from "discord.js";
import { MakeOption, makeOption } from "../option.js";
import {
    AutoCompleteOptionConfig,
    BaseOptionConfig,
    ChoicesOptionConfig,
    createBuilder,
    buildChoices,
    buildAutoComplete,
} from "./base.js";

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
        build(name, command, context) {
            const builder = createBuilder(
                new SlashCommandStringOption(),
                name,
                config
            );

            if (config.minLen != null) builder.setMinLength(config.minLen);
            if (config.maxLen != null) builder.setMaxLength(config.maxLen);

            return builder
                .setChoices(...buildChoices(config))
                .setAutocomplete(
                    buildAutoComplete([command, name], config, context)
                );
        },
    });
}
