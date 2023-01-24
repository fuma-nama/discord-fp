import { ChatInputCommandInteraction } from "discord.js";
import { ApplicationCommandConfig, DescriptionConfig } from "../types";
import { SlashCommandFile } from "./loaders";
import { SlashCommandGroupFile } from "./loaders";
import type { InferOptionType, Option } from "./option";

type SlashOptionsConfig = { [key: string]: Option<any> };

export type SlashCommandConfig<O extends SlashOptionsConfig> =
    DescriptionConfig &
        ApplicationCommandConfig & {
            options?: O;
            execute: SlashCommandExecutor<O>;
        };

export type SlashCommandExecutor<O extends SlashOptionsConfig> = (context: {
    event: ChatInputCommandInteraction;
    options: {
        [K in keyof O]: InferOptionType<O[K]>;
    };
}) => void;

export function slash<Options extends SlashOptionsConfig>(
    config: SlashCommandConfig<Options>
): SlashCommandFile {
    return new SlashCommandFile(config);
}

export type GroupMetaConfig = ApplicationCommandConfig & DescriptionConfig;

/**
 * Register a command group
 */
export function group(config: GroupMetaConfig): SlashCommandGroupFile {
    return new SlashCommandGroupFile(config);
}
