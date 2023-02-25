import { LoadContext } from "@/shared/loader.js";
import { SlashCommandKey } from "@/listener/keys.js";
import {
    SlashCommandIntegerOption,
    SlashCommandNumberOption,
} from "discord.js";
import { makeOption, MakeOption } from "./base.js";
import {
    BaseOptionConfig,
    ChoicesOptionConfig,
    createBuilder,
    AutoCompleteOptionConfig,
    buildChoices,
    buildAutoComplete,
} from "./base.js";

export type NumberOptionConfig<Required extends boolean> =
    BaseOptionConfig<Required> &
        ChoicesOptionConfig<number> &
        AutoCompleteOptionConfig & {
            min?: number;
            max?: number;
        };

export function number<Required extends boolean = true>(
    config: NumberOptionConfig<Required>
): MakeOption<number, Required> {
    return makeOption(config, {
        build(name, command, context) {
            return createNumberBuilder(new SlashCommandNumberOption(), config, {
                name,
                command,
                context,
            });
        },
        parse(v) {
            return (v?.value as number) ?? null;
        },
    });
}

export function createNumberBuilder<Required extends boolean>(
    base: SlashCommandIntegerOption | SlashCommandNumberOption,
    config: NumberOptionConfig<Required>,
    {
        name,
        command,
        context,
    }: {
        name: string;
        command: SlashCommandKey;
        context: LoadContext;
    }
) {
    const builder = createBuilder(base, name, config);
    if (config.min != null) builder.setMinValue(config.min);
    if (config.max != null) builder.setMaxValue(config.max);

    return builder
        .addChoices(...buildChoices(config))
        .setAutocomplete(buildAutoComplete([command, name], config, context));
}
