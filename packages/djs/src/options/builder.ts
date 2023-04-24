import { LoadContext } from "@/utils/loader.js";
import {
    ApplicationCommandOptionBase,
    APIApplicationCommandOptionChoice,
    AutocompleteInteraction,
    LocalizationMap,
    SlashCommandIntegerOption,
    SlashCommandNumberOption,
} from "discord.js";
import { NumberOptionConfig } from "./index.js";
import { AutoCompleteKey, SlashCommandKey } from "@/listener/keys.js";

export type BaseOptionConfig = {
    description: string;
    names?: LocalizationMap;
    descriptions?: LocalizationMap;

    /**
     * default: true
     */
    required?: boolean;
};

export function createBuilder<T extends ApplicationCommandOptionBase>(
    builder: T,
    name: string,
    config: BaseOptionConfig
): T {
    return builder
        .setName(name)
        .setDescription(config.description)
        .setNameLocalizations(config.names ?? {})
        .setDescriptionLocalizations(config.descriptions ?? {})
        .setRequired(config.required ?? true);
}

export type ChoicesOptionConfig<V extends string | number> = {
    choices?: {
        [name: string]: {
            names?: LocalizationMap;
            value: V;
        };
    };
};

export function buildChoices<V extends string | number>(
    config: ChoicesOptionConfig<V>
): APIApplicationCommandOptionChoice<V>[] {
    const choices = config.choices ?? {};
    const mapped: APIApplicationCommandOptionChoice<V>[] = [];

    for (const [name, value] of Object.entries(choices)) {
        mapped.push({
            name: name,
            name_localizations: value.names,
            value: value.value,
        });
    }

    return mapped;
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
    base: SlashCommandIntegerOption | SlashCommandNumberOption,
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
    const builder = createBuilder(base, name, config);
    if (config.min != null) builder.setMinValue(config.min);
    if (config.max != null) builder.setMaxValue(config.max);

    return builder
        .addChoices(...buildChoices(config))
        .setAutocomplete(buildAutoComplete([command, name], config, context));
}
