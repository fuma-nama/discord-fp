import { ChatInputCommandInteraction } from "discord.js";
import { ApplicationCommandConfig, DescriptionConfig } from "../types";
import { SlashCommandFile } from "./loaders";
import { InferOptionType, SlashOptions, SlashOptionsConfig } from "./options";
import { SlashCommandGroupFile } from "./loaders";

export type SlashCommandConfig<O extends SlashOptionsConfig> =
    DescriptionConfig &
        ApplicationCommandConfig & {
            options?: O;
            execute: SlashCommandExecutor<SlashOptions<O>>;
        };

export type SlashCommandExecutor<O extends SlashOptions<any>> = (context: {
    event: ChatInputCommandInteraction;
    options: {
        [K in keyof O]: InferOptionType<O[K]>;
    };
}) => void;

export function slash<
    OptionsConfig extends SlashOptionsConfig,
    Options extends SlashOptions<OptionsConfig>
>(config: SlashCommandConfig<Options>): SlashCommandFile {
    return new SlashCommandFile(config);
}

export type GroupMetaConfig = ApplicationCommandConfig & DescriptionConfig;

/**
 * Register a command group
 */
export function group(config: GroupMetaConfig): SlashCommandGroupFile {
    return new SlashCommandGroupFile(config);
}
