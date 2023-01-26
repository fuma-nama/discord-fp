import { LoadContext } from "@/core/loader.js";
import { SlashCommandKey } from "@/listener/slash.js";
import {
    APIApplicationCommandOptionChoice,
    ApplicationCommandOptionBase,
    AutocompleteInteraction,
    LocalizationMap,
} from "discord.js";

export type BaseOptionConfig<Required extends boolean> = {
    description: string;
    names?: LocalizationMap;
    descriptions?: LocalizationMap;

    /**
     * default: true
     */
    required?: Required;
};

export function createBuilder<
    T extends ApplicationCommandOptionBase,
    Required extends boolean
>(builder: T, name: string, config: BaseOptionConfig<Required>): T {
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

export type AutoCompleteKey = [key: SlashCommandKey, name: string];

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
