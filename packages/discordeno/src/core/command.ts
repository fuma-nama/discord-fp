import { MenuCommandLoader } from "@/menu.js";
import {
    createMessageMenuCommandLoader,
    MessageMenuCommandConfig,
    createUserMenuCommandLoader,
    UserMenuCommandConfig,
} from "@/menu.js";
import { SlashCommandGroupLoader, SlashGroupConfig } from "@/group.js";
import {
    SlashCommandConfig,
    SlashCommandLoader,
    SlashOptionRecord,
} from "@/slash.js";
import { MiddlewareFn } from "@discord-fp/core";
import { Interaction } from "discordeno";

type AnyMiddlewareFn = MiddlewareFn<Interaction, unknown, unknown>;

export type CommandParams<TContextOut = unknown> = {
    _ctx: TContextOut;
};

function makeBuilder<Params extends CommandParams>(def: {
    middlewares: AnyMiddlewareFn[];
}): CommandBuilder<Params> {
    const { middlewares } = def;

    return {
        middleware(fn) {
            return makeBuilder({ middlewares: [...middlewares, fn] });
        },
        slash(config) {
            const loader = new SlashCommandLoader(
                config as SlashCommandConfig<SlashOptionRecord, unknown>
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

    slash<Options extends SlashOptionRecord = {}>(
        config: SlashCommandConfig<Options, Params["_ctx"]>
    ): SlashCommandLoader;
    user(config: UserMenuCommandConfig<Params["_ctx"]>): MenuCommandLoader;
    message(
        config: MessageMenuCommandConfig<Params["_ctx"]>
    ): MenuCommandLoader;

    group(config: SlashGroupConfig): SlashCommandGroupLoader;
}
