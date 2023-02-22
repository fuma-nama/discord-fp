import { MenuCommandLoader } from "@/menu/context.js";
import { message, MessageMenuCommandConfig } from "@/menu/message.js";
import { user, UserMenuCommandConfig } from "@/menu/user.js";
import { SlashCommandGroupLoader, SlashGroupConfig } from "@/slash/group.js";
import {
    SlashCommandConfig,
    SlashCommandLoader,
    SlashOptionsConfig,
} from "@/slash/slash.js";
import { MiddlewareFn } from "./middleware.js";

export type CommandParams<TContextOut = unknown> = {
    _ctx: TContextOut;
};

function makeBuilder<Params extends CommandParams>(def: {
    middlewares: MiddlewareFn<any, any>[];
}): Builder<Params> {
    const { middlewares } = def;

    return {
        middleware<$Context = {}>(fn: MiddlewareFn<Params, $Context>) {
            return makeBuilder<{
                _ctx: $Context;
            }>({ middlewares: [...middlewares, fn] });
        },
        slash(config) {
            const loader = new SlashCommandLoader(config);
            loader.middlewares = middlewares;

            return loader;
        },
        group(config) {
            const loader = new SlashCommandGroupLoader(config);

            return loader;
        },
        user(config) {
            const loader = user(config);
            loader.middlewares = middlewares;

            return loader;
        },
        message(config) {
            const loader = message(config);
            loader.middlewares = middlewares;

            return loader;
        },
    };
}

export function initBuilder(): Builder<{ _ctx: {} }> {
    return makeBuilder({
        middlewares: [],
    });
}

export interface Builder<Params extends CommandParams> {
    middleware<$Context = {}>(
        fn: MiddlewareFn<Params, $Context>
    ): Builder<{
        _ctx: $Context;
    }>;

    slash<Options extends SlashOptionsConfig>(
        config: SlashCommandConfig<Options, Params["_ctx"]>
    ): SlashCommandLoader;
    user(config: UserMenuCommandConfig<Params["_ctx"]>): MenuCommandLoader;
    message(
        config: MessageMenuCommandConfig<Params["_ctx"]>
    ): MenuCommandLoader;

    group(config: SlashGroupConfig): SlashCommandGroupLoader;
}

export * from "./middleware.js";
