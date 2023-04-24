import {
    createMessageMenuCommandLoader,
    MessageMenuCommandConfig,
    createUserMenuCommandLoader,
    UserMenuCommandConfig,
    MenuCommandLoader,
} from "@/menu.js";
import { SlashCommandGroupLoader, SlashGroupConfig } from "@/group.js";
import {
    SlashCommandConfig,
    SlashCommandLoader,
    SlashOptionsConfig,
} from "@/slash.js";
import { MiddlewareFn } from "@discord-fp/core";
import {
    Interaction,
    MessageContextMenuCommandInteraction,
    UserContextMenuCommandInteraction,
} from "discord.js";

export type CommandParams<TContextOut = unknown> = {
    _ctx: TContextOut;
};

function makeBuilder<Params extends CommandParams>(def: {
    middlewares: MiddlewareFn<any, any, any>[];
}): CommandBuilder<Params> {
    const { middlewares } = def;

    return {
        middleware(fn) {
            return makeBuilder({ middlewares: [...middlewares, fn] });
        },
        slash(config) {
            const loader = new SlashCommandLoader(
                config as SlashCommandConfig<SlashOptionsConfig, unknown>
            );
            loader.middlewares = middlewares;

            return loader;
        },
        group(config) {
            const loader = new SlashCommandGroupLoader(config);

            return loader;
        },
        user(config) {
            const loader = createUserMenuCommandLoader(config);
            loader.middlewares = middlewares;

            return loader;
        },
        message(config) {
            const loader = createMessageMenuCommandLoader(config);
            loader.middlewares = middlewares;

            return loader;
        },
    };
}

export function initCommandBuilder(): CommandBuilder<{ _ctx: {} }> {
    return makeBuilder({
        middlewares: [],
    });
}

export interface CommandBuilder<Params extends CommandParams> {
    middleware<$Context = {}>(
        fn: MiddlewareFn<Interaction, Params["_ctx"], $Context>
    ): CommandBuilder<{
        _ctx: $Context;
    }>;

    slash<Options extends SlashOptionsConfig = {}>(
        config: SlashCommandConfig<Options, Params["_ctx"]>
    ): SlashCommandLoader;
    user(
        config: UserMenuCommandConfig<Params["_ctx"]>
    ): MenuCommandLoader<UserContextMenuCommandInteraction>;
    message(
        config: MessageMenuCommandConfig<Params["_ctx"]>
    ): MenuCommandLoader<MessageContextMenuCommandInteraction>;

    group(config: SlashGroupConfig): SlashCommandGroupLoader;
}
