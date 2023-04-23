import { SlashCommandKey, LoadContext } from "@/index.js";
import {
    AutoCompleteOptionConfig,
    BaseOptionConfig,
    ChoicesOptionConfig,
    buildAutoComplete,
    buildChoices,
    createBuilder,
    optionFactory,
} from "./factory.js";
import {
    ApplicationCommandOptionTypes,
    Attachment,
    Channel,
    ChannelTypes,
    Member,
    Role,
    User,
} from "discordeno";

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

export type UserOrMemberOption = {
    user: User;
    member?: Member;
};

export type MentionableOption =
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

const options = {
    string: optionFactory<string, StringOptionConfig>(
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
    role: optionFactory<Role, BaseOptionConfig>((config, name) => {
        return createBuilder(ApplicationCommandOptionTypes.Role, name, config);
    }),
    user: optionFactory<UserOrMemberOption, UserOptionConfig>(
        (config, name) => {
            return createBuilder(
                ApplicationCommandOptionTypes.User,
                name,
                config
            );
        }
    ),
    int: optionFactory<number, NumberOptionConfig>(
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
    number: optionFactory<number, NumberOptionConfig>(
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
    channel: optionFactory<Channel, ChannelOptionConfig>((config, name) => {
        const builder = createBuilder(
            ApplicationCommandOptionTypes.Channel,
            name,
            config
        );

        if (config.types != null) {
            builder.channelTypes = config.types;
        }

        return builder;
    }),
    attachment: optionFactory<Attachment, AttachmentOptionConfig>(
        (config, name) => {
            return createBuilder(
                ApplicationCommandOptionTypes.Attachment,
                name,
                config
            );
        }
    ),
    boolean: optionFactory<boolean, BooleanOptionConfig>((config, name) => {
        return createBuilder(
            ApplicationCommandOptionTypes.Boolean,
            name,
            config
        );
    }),
    mention: optionFactory<MentionableOption, BaseOptionConfig>(
        (config, name) => {
            return createBuilder(
                ApplicationCommandOptionTypes.Mentionable,
                name,
                config
            );
        }
    ),
};

function createNumberBuilder(
    type: ApplicationCommandOptionTypes,
    config: NumberOptionConfig,
    {
        name,
        command,
        context,
    }: {
        name: string;
        command: SlashCommandKey;
        context: LoadContext;
    }
) {
    const builder = createBuilder(type, name, config);
    builder.choices = buildChoices(config);
    builder.autocomplete = buildAutoComplete([command, name], config, context);

    if (config.min != null) builder.minValue = config.min;
    if (config.max != null) builder.maxValue = config.max;

    return builder;
}

export { options, optionFactory };
