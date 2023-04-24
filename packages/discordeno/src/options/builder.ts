import { LoadContext } from "@/utils/types.js";
import { AutoCompleteKey, SlashCommandKey } from "@/listener/keys.js";
import {
    ApplicationCommandOption,
    ApplicationCommandOptionChoice,
    ApplicationCommandOptionTypes,
    Localization,
} from "discordeno";
import { AutocompleteInteraction } from "@/utils/types.js";
import { NumberOptionConfig } from "./index.js";

export type BaseOptionConfig = {
    description: string;
    names?: Localization;
    descriptions?: Localization;

    /**
     * default: true
     */
    required?: boolean;
};

export function createBuilder(
    type: ApplicationCommandOptionTypes,
    name: string,
    config: BaseOptionConfig
): ApplicationCommandOption {
    return {
        type: type,
        name: name,
        description: config.description,
        descriptionLocalizations: config.descriptions,
        required: config.required ?? true,
    };
}

export type ChoicesOptionConfig<V extends string | number> = {
    choices?: {
        [name: string]: {
            names?: Localization;
            value: V;
        };
    };
};

export function buildChoices<V extends string | number>(
    config: ChoicesOptionConfig<V>
): ApplicationCommandOptionChoice[] {
    return Object.entries(config.choices ?? {}).map(([name, value]) => {
        return {
            name: name,
            nameLocalizations: value.names,
            value: value.value,
        };
    });
}

export type AutoCompleteOptionConfig = {
    autoComplete?:
        | ((e: AutocompleteInteraction) => void | Promise<void>)
        | boolean;
};

export function buildAutoComplete(
    key: AutoCompleteKey,
    config: AutoCompleteOptionConfig,
    context: LoadContext
): boolean {
    const autoComplete = config.autoComplete;
    if (autoComplete == null || autoComplete == false) return false;

    if (typeof autoComplete === "function") {
        context.listeners.autoComplete.set(key, (e) => autoComplete(e));
    }

    return true;
}

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
