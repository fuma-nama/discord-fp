import { LoadContext } from "@/shared/loader.js";
import { SlashCommandKey } from "@/listener/keys.js";
import {
    BaseOptionConfig,
    ChoicesOptionConfig,
    createBuilder,
    AutoCompleteOptionConfig,
    buildChoices,
    buildAutoComplete,
    optionFactory,
} from "./base.js";
import { ApplicationCommandOptionTypes } from "discordeno";

export type NumberOptionConfig = BaseOptionConfig &
    ChoicesOptionConfig<number> &
    AutoCompleteOptionConfig & {
        min?: number;
        max?: number;
    };

export const number = optionFactory<number, NumberOptionConfig>(
    (config, name, command, context) => {
        return createNumberBuilder(
            ApplicationCommandOptionTypes.Number,
            config,
            {
                name,
                command,
                context,
            }
        );
    }
);

export const int = optionFactory<number, NumberOptionConfig>(
    (config, name, command, context) => {
        return createNumberBuilder(
            ApplicationCommandOptionTypes.Integer,
            config,
            {
                name,
                command,
                context,
            }
        );
    }
);

export function createNumberBuilder(
    type: ApplicationCommandOptionTypes,
    config: NumberOptionConfig,
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
    const builder = createBuilder(type, name, config);
    builder.choices = buildChoices(config);
    builder.autocomplete = buildAutoComplete([command, name], config, context);

    if (config.min != null) builder.minValue = config.min;
    if (config.max != null) builder.maxValue = config.max;

    return builder;
}
