import { LoadContext } from "@/utils/types.js";
import {
    AutoCompleteOptionConfig,
    BaseOptionConfig,
    ChoicesOptionConfig,
    buildAutoComplete,
    buildChoices,
    createBuilder,
    createNumberBuilder,
} from "./builder.js";
import {
    ApplicationCommandOption,
    ApplicationCommandOptionTypes,
    Attachment,
    Channel,
    ChannelTypes,
    Member,
    Role,
    User,
} from "discordeno";
import { InferOption, optionFactory } from "@discord-fp/core";

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

export type AttachmentOptionConfig = BaseOptionConfig;
export type BooleanOptionConfig = BaseOptionConfig;
export type UserOptionConfig = BaseOptionConfig;

export type UserOptionValue = {
    value: User;
    member?: Member;
};

export type MentionableOptionValue =
    | {
          type: "user";
          member?: Member;
          user: User;
      }
    | {
          type: "role";
          value: Role;
      };

export type ChannelOptionConfig = BaseOptionConfig & {
    types?: ChannelTypes[];
};

type Global = {
    context: LoadContext;
    output: ApplicationCommandOption;
};

export type Option<T> = InferOption<T, Global>;

export const options = {
    string: optionFactory<string, StringOptionConfig, Global>(
        (config, name, command, context) => {
            const builder = createBuilder(
                ApplicationCommandOptionTypes.String,
                name,
                config
            );
            builder.choices = buildChoices(config);
            builder.autocomplete = buildAutoComplete(
                [command, name],
                config,
                context
            );
            if (config.minLen != null) builder.minLength = config.minLen;
            if (config.maxLen != null) builder.maxLength = config.maxLen;

            return builder;
        }
    ),
    role: optionFactory<Role, BaseOptionConfig, Global>((config, name) => {
        return createBuilder(ApplicationCommandOptionTypes.Role, name, config);
    }),
    user: optionFactory<UserOptionValue, UserOptionConfig, Global>(
        (config, name) => {
            return createBuilder(
                ApplicationCommandOptionTypes.User,
                name,
                config
            );
        }
    ),
    int: optionFactory<number, NumberOptionConfig, Global>(
        (config, name, command, context) => {
            return createNumberBuilder(
                ApplicationCommandOptionTypes.Integer,
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
            return createNumberBuilder(
                ApplicationCommandOptionTypes.Number,
                config,
                {
                    name,
                    command,
                    context,
                }
            );
        }
    ),
    channel: optionFactory<Channel, ChannelOptionConfig, Global>(
        (config, name) => {
            const builder = createBuilder(
                ApplicationCommandOptionTypes.Channel,
                name,
                config
            );

            if (config.types != null) {
                builder.channelTypes = config.types;
            }

            return builder;
        }
    ),
    attachment: optionFactory<Attachment, AttachmentOptionConfig, Global>(
        (config, name) => {
            return createBuilder(
                ApplicationCommandOptionTypes.Attachment,
                name,
                config
            );
        }
    ),
    boolean: optionFactory<boolean, BooleanOptionConfig, Global>(
        (config, name) => {
            return createBuilder(
                ApplicationCommandOptionTypes.Boolean,
                name,
                config
            );
        }
    ),
    mention: optionFactory<MentionableOptionValue, BaseOptionConfig, Global>(
        (config, name) => {
            return createBuilder(
                ApplicationCommandOptionTypes.Mentionable,
                name,
                config
            );
        }
    ),
};
