import { FileLoader, LoadContext } from "@/core/loader.js";
import { SlashCommandKey } from "@/listener/slash.js";
import { createSlashBuilder, createBaseBuilder } from "@/utils/builder.js";
import {
    ChatInputCommandInteraction,
    SharedSlashCommandOptions,
    SlashCommandSubcommandBuilder,
} from "discord.js";
import { ApplicationCommandConfig, DescriptionConfig, File } from "../types.js";
import type { InferOptionType, Option } from "./option.js";

type SlashOptionsConfig = { [key: string]: Option<any> };

export type SlashCommandConfig<O extends SlashOptionsConfig> =
    DescriptionConfig &
        ApplicationCommandConfig & {
            options?: O;
            execute: (
                context: SlashCommandInteractionContext<O>
            ) => void | Promise<void>;
        };

export type SlashCommandInteractionContext<O extends SlashOptionsConfig> = {
    event: ChatInputCommandInteraction;
    options: {
        [K in keyof O]: InferOptionType<O[K]>;
    };
};

export function slash<Options extends SlashOptionsConfig = never>(
    config: SlashCommandConfig<Options>
): SlashCommandFile {
    return new SlashCommandFile(config);
}

function loadOptions(
    builder: SharedSlashCommandOptions,
    config: SlashCommandConfig<any>,
    context: LoadContext,
    key: SlashCommandKey
): void {
    const options = config.options ?? {};

    for (const [name, info] of Object.entries<Option<never>>(options)) {
        const build = info.build(name, key, context);

        builder.options.push(build);
    }
}

export class SlashCommandFile extends FileLoader {
    readonly config: SlashCommandConfig<any>;
    readonly optionMap: [string, Option<never>][];

    constructor(config: SlashCommandConfig<any>) {
        super();
        this.config = config;
        this.optionMap = Object.entries<Option<never>>(this.config.options);
    }

    onEvent = (e: ChatInputCommandInteraction) => {
        const options: any = {};

        for (const [key, option] of this.optionMap) {
            const v = e.options.get(key, option.config.required);

            options[key] = option.parse(v);
        }

        this.config.execute({
            event: e,
            options: options,
        });
    };

    override load({ name }: File, context: LoadContext) {
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
