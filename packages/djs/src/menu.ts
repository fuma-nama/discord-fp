import {
    ApplicationCommandType,
    ContextMenuCommandType,
    MessageContextMenuCommandInteraction,
    UserContextMenuCommandInteraction,
} from "discord.js";
import { ApplicationCommandConfig, EventWithContext } from "./utils/types.js";
import { executeWithMiddleware, File, MiddlewareFn } from "@discord-fp/core";
import { ListenerModule, LoadContext, FPFileLoader } from "./index.js";
import { MenuCommandKey } from "./listener/keys.js";
import { createContextBuilder } from "./utils/builder.js";

export type MessageMenuCommandConfig<Context> = ContextCommandConfig<
    MessageContextMenuCommandInteraction,
    Context
>;

export function createMessageMenuCommandLoader(
    config: MessageMenuCommandConfig<any>
) {
    return createMenuCommandLoader({
        config,
        type: ApplicationCommandType.Message,
        listen(listeners, key, callback) {
            listeners.message.set(key, callback);
        },
    });
}

export type UserMenuCommandConfig<Context> = ContextCommandConfig<
    UserContextMenuCommandInteraction,
    Context
>;

export function createUserMenuCommandLoader(
    config: UserMenuCommandConfig<any>
) {
    return createMenuCommandLoader({
        config,
        type: ApplicationCommandType.User,
        listen(listeners, key, callback) {
            listeners.user.set(key, callback);
        },
    });
}

type ContextCommandConfig<E, Context> = ApplicationCommandConfig & {
    execute: (e: EventWithContext<E, Context>) => void | Promise<void>;
};

export function createMenuCommandLoader<E, Context>({
    config,
    type,
    listen,
}: {
    config: ContextCommandConfig<E, Context>;
    type: ContextMenuCommandType;
    listen: (
        listeners: ListenerModule,
        key: MenuCommandKey,
        callback: (e: E) => void
    ) => void;
}): MenuCommandLoader<E> {
    return {
        middlewares: [],
        load({ name }: File, context: LoadContext): void | Promise<void> {
            const builder = createContextBuilder(name, config).setType(type);

            context.commands.push(builder);

            listen(context.listeners, [name], (e) => {
                return executeWithMiddleware(e, this.middlewares, (event) =>
                    config.execute(event)
                );
            });
        },
    };
}

export interface MenuCommandLoader<E> extends FPFileLoader {
    middlewares: MiddlewareFn<E, any, any>[];
}
