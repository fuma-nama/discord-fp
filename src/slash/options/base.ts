import { LoadContext } from "@/shared/loader.js";
import { AutoCompleteKey, SlashCommandKey } from "@/listener/keys.js";
import {
    ApplicationCommandOptionBase,
    CommandInteractionOption,
    APIApplicationCommandOptionChoice,
    AutocompleteInteraction,
    LocalizationMap,
} from "discord.js";

export type InferOptionType<T> = T extends Option<infer P> ? P : never;

export type Option<T> = {
    readonly config: BaseOptionConfig<boolean>;
    build(
        name: string,
        command: SlashCommandKey,
        context: LoadContext
    ): ApplicationCommandOptionBase;
    parse(value: CommandInteractionOption | null): T;
    transform<R>(fn: (v: T) => R): Option<R>;
};

export type OptionExtend<T> = {
    build: (
        name: string,
        command: SlashCommandKey,
        context: LoadContext
    ) => ApplicationCommandOptionBase;
    parse: (value: CommandInteractionOption | null) => T | null;
};

export type MakeOption<T, Required extends boolean> = Option<
    Required extends true ? T : T | null
>;

export function makeOption<T, Required extends boolean = true>(
    config: BaseOptionConfig<Required>,
    option: OptionExtend<Required extends true ? T : T | null>
): Option<Required extends true ? T : T | null> {
    return {
        config: config,
        ...option,
        parse(value) {
            return option.parse(value) as T;
        },
        transform<R>(fn: (v: T) => R) {
            return {
                ...(this as Option<R>),
                parse(value) {
                    const parsed = option.parse(value) as T;
                    return fn(parsed);
                },
            };
        },
    };
}

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
