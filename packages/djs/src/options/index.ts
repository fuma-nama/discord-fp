import {
    AutoCompleteOptionConfig,
    createNumberBuilder,
    ChoicesOptionConfig,
    buildAutoComplete,
    buildChoices,
    createBuilder,
    BaseOptionConfig,
} from "./builder.js";
import { InferOption, optionFactory } from "@discord-fp/core";
import { LoadContext } from "@/utils/loader.js";
import {
    APIInteractionDataResolvedChannel,
    APIRole,
    ApplicationCommandOptionAllowedChannelTypes,
    ApplicationCommandOptionBase,
    Attachment,
    GuildBasedChannel,
    Role,
    SlashCommandAttachmentOption,
    SlashCommandBooleanOption,
    SlashCommandChannelOption,
    SlashCommandIntegerOption,
    SlashCommandMentionableOption,
    SlashCommandNumberOption,
    SlashCommandRoleOption,
    SlashCommandStringOption,
    SlashCommandUserOption,
} from "discord.js";
import { ParsedUserValue, ParsedMentionValue } from "./parser.js";

export type Option<T> = InferOption<T, Global>;

export type StringOptionConfig = BaseOptionConfig &
    ChoicesOptionConfig<string> &
    AutoCompleteOptionConfig & {
        minLen?: number;
        maxLen?: number;
    };

export type NumberOptionConfig = BaseOptionConfig &
    ChoicesOptionConfig<number> &
    AutoCompleteOptionConfig & {
        min?: number;
        max?: number;
    };

export type ChannelOptionConfig = BaseOptionConfig & {
    types?: ApplicationCommandOptionAllowedChannelTypes[];
};

type ParsedChannelValue = APIInteractionDataResolvedChannel | GuildBasedChannel;

type Global = {
    context: LoadContext;
    output: ApplicationCommandOptionBase;
};

export const options = {
    string: optionFactory<string, StringOptionConfig, Global>(
        (config, name, command, context) => {
            const builder = createBuilder(
                new SlashCommandStringOption(),
                name,
                config
            );

            if (config.minLen != null) builder.setMinLength(config.minLen);
            if (config.maxLen != null) builder.setMaxLength(config.maxLen);

            return builder
                .setChoices(...buildChoices(config))
                .setAutocomplete(
                    buildAutoComplete([command, name], config, context)
                );
        }
    ),
    role: optionFactory<Role | APIRole, BaseOptionConfig, Global>(
        (config, name) => {
            return createBuilder(new SlashCommandRoleOption(), name, config);
        }
    ),
    user: optionFactory<ParsedUserValue, BaseOptionConfig, Global>(
        (config, name) => {
            return createBuilder(new SlashCommandUserOption(), name, config);
        }
    ),
    int: optionFactory<number, NumberOptionConfig, Global>(
        (config, name, command, context) => {
            return createNumberBuilder(
                new SlashCommandIntegerOption(),
                config,
                {
                    name,
                    command,
                    context,
                }
            );
        }
    ),
    number: optionFactory<number, NumberOptionConfig, Global>(
        (config, name, command, context) => {
            return createNumberBuilder(new SlashCommandNumberOption(), config, {
                name,
                command,
                context,
            });
        }
    ),
    channel: optionFactory<ParsedChannelValue, ChannelOptionConfig, Global>(
        (config, name) => {
            const builder = createBuilder(
                new SlashCommandChannelOption(),
                name,
                config
            );

            if (config.types != null) {
                builder.addChannelTypes(...config.types);
            }

            return builder;
        }
    ),
    attachment: optionFactory<Attachment, BaseOptionConfig, Global>(
        (config, name) => {
            return createBuilder(
                new SlashCommandAttachmentOption(),
                name,
                config
            );
        }
    ),
    boolean: optionFactory<boolean, BaseOptionConfig, Global>(
        (config, name) => {
            return createBuilder(new SlashCommandBooleanOption(), name, config);
        }
    ),
    mention: optionFactory<ParsedMentionValue, BaseOptionConfig, Global>(
        (config, name) => {
            return createBuilder(
                new SlashCommandMentionableOption(),
                name,
                config
            );
        }
    ),
};
