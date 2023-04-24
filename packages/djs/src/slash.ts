import { EventWithContext } from "@/utils/types.js";
import { FPFileLoader, LoadContext } from "@/utils/loader.js";
import { createSlashBuilder, createBaseBuilder } from "@/utils/builder.js";
import {
    ChatInputCommandInteraction,
    SharedSlashCommandOptions,
    SlashCommandSubcommandBuilder,
} from "discord.js";
import type { Option } from "./options/index.js";
import type {
    ApplicationCommandConfig,
    DescriptionConfig,
} from "@/utils/types.js";
import {
    File,
    InferOptionType,
    MiddlewareFn,
    executeWithMiddleware,
} from "@discord-fp/core";
import { parseOptionValue } from "./options/parser.js";
import { SlashCommandKey } from "./listener/keys.js";

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
> = EventWithContext<ChatInputCommandInteraction, $Context> & {
    options: {
        [K in keyof O]: InferOptionType<O[K]>;
    };
};

function loadOptions(
    builder: SharedSlashCommandOptions,
    config: SlashCommandConfig<SlashOptionsConfig, unknown>,
    context: LoadContext,
    key: SlashCommandKey
): void {
    const options = config.options ?? {};

    for (const [name, info] of Object.entries(options)) {
        const build = info.build(name, key, context);

        builder.options.push(build);
    }
}

export class SlashCommandLoader implements FPFileLoader {
    readonly config: SlashCommandConfig<SlashOptionsConfig, unknown>;
    readonly optionMap: [string, Option<unknown>][];
    middlewares: MiddlewareFn<any, any, any>[] = [];

    constructor(config: SlashCommandConfig<SlashOptionsConfig, unknown>) {
        this.config = config;
        this.optionMap = Object.entries<Option<unknown>>(
            this.config.options ?? {}
        );
    }

    onEvent = (e: ChatInputCommandInteraction) => {
        const options: any = {};

        for (const [key, option] of this.optionMap) {
            const data = e.options.get(key, false);

            options[key] = option.parse(
                data != null ? parseOptionValue(data) : null
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
