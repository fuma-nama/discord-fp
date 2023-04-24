import { SlashCommandKey } from "@/listener/keys.js";
import { createSlashBuilder } from "@/utils/builder.js";
import { Option } from "./options/index.js";
import {
    Interaction,
    ApplicationCommandOption,
    ApplicationCommandOptionTypes,
} from "discordeno";
import type {
    ApplicationCommandConfig,
    DescriptionConfig,
    Event,
    FPFileLoader,
    LoadContext,
} from "@/utils/types.js";
import {
    MiddlewareFn,
    executeWithMiddleware,
    File,
    InferOptionType,
} from "@discord-fp/core";
import { getRawOptions, parseOptionValue } from "./options/parser.js";

export type SlashOptionRecord = Record<string, Option<unknown>>;

export type SlashCommandConfig<
    O extends SlashOptionRecord,
    $Context
> = DescriptionConfig &
    ApplicationCommandConfig & {
        options?: O;
        execute: (
            context: SlashCommandInteractionContext<O, $Context>
        ) => void | Promise<void>;
    };

export type SlashCommandInteractionContext<
    O extends SlashOptionRecord,
    $Context
> = Event<Interaction, $Context> & {
    options: {
        [K in keyof O]: InferOptionType<O[K]>;
    };
};

function loadOptions(
    config: SlashCommandConfig<SlashOptionRecord, unknown>,
    context: LoadContext,
    key: SlashCommandKey
): ApplicationCommandOption[] {
    const options = config.options ?? {};

    return Object.entries(options).map(([name, info]) => {
        return info.build(name, key, context);
    });
}

export class SlashCommandLoader implements FPFileLoader {
    readonly config: SlashCommandConfig<SlashOptionRecord, unknown>;
    readonly optionMap: [string, Option<unknown>][];
    middlewares: MiddlewareFn<any, any, any>[] = [];

    constructor(config: SlashCommandConfig<SlashOptionRecord, unknown>) {
        this.config = config;
        this.optionMap = Object.entries<Option<unknown>>(
            this.config.options ?? {}
        );
    }

    onEvent = (e: Interaction) => {
        const raw = getRawOptions(e);
        const options: any = {};

        for (const [key, option] of this.optionMap) {
            const data = raw?.find((v) => v.name === key);

            options[key] = option.parse(
                data != null ? parseOptionValue(data, e) : null
            );
        }

        executeWithMiddleware(e, this.middlewares, (e) => {
            return this.config.execute({ ...e, options });
        });
    };

    load({ name }: File, context: LoadContext) {
        const config = this.config;
        const command = createSlashBuilder(name, config);
        const key: SlashCommandKey = [command.name, null, null];

        command.options = loadOptions(config, context, key);
        context.listeners.slash.set(key, this.onEvent);
        context.commands.push(command);
    }

    loadSubCommand(
        { name }: File,
        context: LoadContext,
        parent: [command: string, group: string | null]
    ): ApplicationCommandOption {
        const config = this.config;
        const command: ApplicationCommandOption = {
            type: ApplicationCommandOptionTypes.SubCommand,
            name: config.name ?? name,
            nameLocalizations: config.names,
            description: config.description,
            descriptionLocalizations: config.descriptions,
        };

        const key: SlashCommandKey = [...parent, command.name];
        command.options = loadOptions(config, context, key);
        context.listeners.slash.set(key, this.onEvent);
        return command;
    }
}
