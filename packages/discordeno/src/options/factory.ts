import { LoadContext } from "@/utils/loader.js";
import { AutoCompleteKey, SlashCommandKey } from "@/listener/keys.js";
import {
    ApplicationCommandOption,
    ApplicationCommandOptionChoice,
    ApplicationCommandOptionTypes,
    Localization,
} from "discordeno";
import { AutocompleteInteraction } from "@/utils/types.js";

export type InferOptionType<T> = T extends Option<infer P> ? P : never;

export type Option<T> = {
    readonly config: BaseOptionConfig;
    build(
        name: string,
        command: SlashCommandKey,
        context: LoadContext
    ): ApplicationCommandOption;
    parse(value: unknown): T;
    transform<R>(fn: (v: T) => R): Option<R>;
};

export function optionFactory<T, Config extends BaseOptionConfig>(
    build: (
        config: Config,
        name: string,
        command: SlashCommandKey,
        context: LoadContext
    ) => ApplicationCommandOption
): {
    <Required extends boolean = true>(
        config: Omit<Config, "required"> & { required?: Required }
    ): Option<Required extends true ? T : T | null>;
} {
    return (config) => {
        return {
            config,
            build: (...args) => build(config as Config, ...args),
            parse(value) {
                return value as T;
            },
            transform(fn) {
                const parse = this.parse;

                return {
                    ...(this as Option<any>),
                    parse(value) {
                        const parsed = parse(value);

                        return fn(parsed as any);
                    },
                };
            },
        };
    };
}

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
