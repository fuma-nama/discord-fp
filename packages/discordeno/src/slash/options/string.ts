import { ApplicationCommandOptionTypes } from "discordeno";
import {
    AutoCompleteOptionConfig,
    BaseOptionConfig,
    ChoicesOptionConfig,
    createBuilder,
    buildChoices,
    buildAutoComplete,
    optionFactory,
} from "./base.js";

export type StringOptionConfig = BaseOptionConfig &
    ChoicesOptionConfig<string> &
    AutoCompleteOptionConfig & {
        minLen?: number;
        maxLen?: number;
    };

export const string = optionFactory<string, StringOptionConfig>(
    (config, name, command, context) => {
        const builder = createBuilder(
            ApplicationCommandOptionTypes.String,
            name,
            config
        );
        builder.choices = buildChoices(config);
        builder.autocomplete = buildAutoComplete(
            [command, name],
            config,
            context
        );
        if (config.minLen != null) builder.minLength = config.minLen;
        if (config.maxLen != null) builder.maxLength = config.maxLen;

        return builder;
    }
);
