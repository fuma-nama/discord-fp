import { Event } from "@/utils/types.js";
import { executeWithMiddleware, MiddlewareFn } from "@/core/middleware.js";
import { SlashCommandKey } from "@/listener/keys.js";
import { createSlashBuilder } from "@/utils/builder.js";
import {
    Interaction,
    ApplicationCommandOption,
    ApplicationCommandOptionTypes,
} from "discordeno";
import type { FileLoader, LoadContext } from "@/utils/loader.js";
import type { File } from "@/utils/reader.js";
import type { InferOptionType, Option } from "./options/factory.js";
import type {
    ApplicationCommandConfig,
    DescriptionConfig,
} from "@/utils/types.js";
import { MentionableOptionValue, UserOptionValue } from "./index.js";

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

type RawOption = {
    name: string;
    value?: any;
    type: ApplicationCommandOptionTypes;
};
function getRawOptions(e: Interaction): RawOption[] {
    const first = e.data?.options?.[0];

    if (first == null) {
        return [];
    }
    if (first.type === ApplicationCommandOptionTypes.SubCommandGroup) {
        return first.options?.[0].options ?? [];
    }
    if (first.type === ApplicationCommandOptionTypes.SubCommand) {
        return first.options ?? [];
    }

    return e.data?.options ?? [];
}

function parseOptionValue(data: RawOption, interation: Interaction): any {
    const resolved = interation.data?.resolved;

    if (resolved == null || data.value == null) {
        return null;
    }

    if (data.type === ApplicationCommandOptionTypes.User) {
        const id = BigInt(data.value);

        return {
            value: resolved.users?.get(id),
            member: resolved.members?.get(id),
        } as UserOptionValue;
    }

    if (data.type === ApplicationCommandOptionTypes.Attachment) {
        return resolved.attachments?.get(BigInt(data.value));
    }

    if (data.type === ApplicationCommandOptionTypes.Channel) {
        return resolved.channels?.get(BigInt(data.value));
    }

    if (data.type === ApplicationCommandOptionTypes.Role) {
        return resolved.roles?.get(BigInt(data.value));
    }

    if (data.type === ApplicationCommandOptionTypes.Mentionable) {
        const id = BigInt(data.value);
        const role = resolved.roles?.get(id);

        if (role != null) {
            return {
                type: "role",
                value: role,
            } as MentionableOptionValue;
        } else {
            const user = resolved.users?.get(id);
            const member = resolved.members?.get(id);

            return {
                type: "user",
                user,
                member,
            } as MentionableOptionValue;
        }
    }

    return data.value;
}
