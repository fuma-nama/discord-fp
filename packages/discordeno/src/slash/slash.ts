import { Event } from "@/shared/types.js";
import { executeWithMiddleware, MiddlewareFn } from "@/core/middleware.js";
import { FileLoader, LoadContext } from "@/shared/loader.js";
import { SlashCommandKey } from "@/listener/keys.js";
import { createSlashBuilder } from "@/internal/builder.js";
import {
    Interaction,
    ApplicationCommandOption,
    ApplicationCommandOptionTypes,
} from "discordeno";
import type { File } from "@/shared/reader.js";
import type { InferOptionType, Option } from "./options/base.js";
import type {
    ApplicationCommandConfig,
    DescriptionConfig,
} from "@/shared/types.js";

export type SlashOptionsConfig = { [key: string]: Option<any> };

export type SlashCommandConfig<
    O extends SlashOptionsConfig,
    $Context
> = DescriptionConfig &
    ApplicationCommandConfig & {
        options?: O;
        execute: (
            context: SlashCommandInteractionContext<O, $Context>
        ) => void | Promise<void>;
    };

export type SlashCommandInteractionContext<
    O extends SlashOptionsConfig,
    $Context
> = Event<Interaction, $Context> & {
    options: {
        [K in keyof O]: InferOptionType<O[K]>;
    };
};

function loadOptions(
    config: SlashCommandConfig<SlashOptionsConfig, unknown>,
    context: LoadContext,
    key: SlashCommandKey
): ApplicationCommandOption[] {
    const options = config.options ?? {};

    return Object.entries(options).map(([name, info]) => {
        return info.build(name, key, context);
    });
}

export class SlashCommandLoader implements FileLoader {
    readonly type = "file";
    readonly config: SlashCommandConfig<SlashOptionsConfig, unknown>;
    readonly optionMap: [string, Option<unknown>][];
    middlewares: MiddlewareFn<any, any>[] = [];

    constructor(config: SlashCommandConfig<SlashOptionsConfig, unknown>) {
        this.config = config;
        this.optionMap = Object.entries<Option<unknown>>(
            this.config.options ?? {}
        );
    }

    onEvent = (e: Interaction) => {
        const options: any = {};

        for (const [key, option] of this.optionMap) {
            const data = e.data?.options?.find((v) => v.name === key);

            options[key] = option.parse(data?.value ?? null);
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
