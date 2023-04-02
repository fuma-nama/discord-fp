import { Event } from "@/shared/types.js";
import { executeWithMiddleware, MiddlewareFn } from "@/core/middleware.js";
import { FileLoader, LoadContext } from "@/shared/loader.js";
import { SlashCommandKey } from "@/listener/keys.js";
import { createSlashBuilder, createBaseBuilder } from "@/internal/builder.js";
import {
    ChatInputCommandInteraction,
    SharedSlashCommandOptions,
    SlashCommandSubcommandBuilder,
} from "discord.js";
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
> = Event<ChatInputCommandInteraction, $Context> & {
    options: {
        [K in keyof O]: InferOptionType<O[K]>;
    };
};

function loadOptions(
    builder: SharedSlashCommandOptions,
    config: SlashCommandConfig<never, never>,
    context: LoadContext,
    key: SlashCommandKey
): void {
    const options = config.options ?? {};

    for (const [name, info] of Object.entries<Option<never>>(options)) {
        const build = info.build(name, key, context);

        builder.options.push(build);
    }
}

export class SlashCommandLoader implements FileLoader {
    readonly type = "file";
    readonly config: SlashCommandConfig<any, any>;
    readonly optionMap: [string, Option<unknown>][];
    middlewares: MiddlewareFn<any, any>[] = [];

    constructor(config: SlashCommandConfig<any, any>) {
        this.config = config;
        this.optionMap = Object.entries<Option<unknown>>(this.config.options ?? {});
    }

    onEvent = (e: ChatInputCommandInteraction) => {
        const options: any = {};

        for (const [key, option] of this.optionMap) {
            const v = e.options.get(key, option.config.required);

            options[key] = option.parse(v);
        }

        executeWithMiddleware(e, this.middlewares, (e) => {
            return this.config.execute({ ...e, options });
        });
    };

    load({ name }: File, context: LoadContext) {
        const config = this.config;
        const command = createSlashBuilder(name, config);
        const key: SlashCommandKey = [command.name, null, null];

        loadOptions(command, config, context, key);

        context.listeners.slash.set(key, this.onEvent);
        context.commands.push(command);
    }

    loadSubCommand(
        { name }: File,
        context: LoadContext,
        parent: [command: string, group: string | null]
    ): SlashCommandSubcommandBuilder {
        const config = this.config;
        const builder = createBaseBuilder(
            new SlashCommandSubcommandBuilder(),
            name,
            config
        );
        const key: SlashCommandKey = [...parent, builder.name];

        loadOptions(builder, config, context, key);

        context.listeners.slash.set(key, this.onEvent);
        return builder;
    }
}
