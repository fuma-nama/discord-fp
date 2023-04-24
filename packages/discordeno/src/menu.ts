import { MenuCommandKey } from "@/listener/keys.js";
import { ListenerModule } from "@/listener/module.js";
import {
    ApplicationCommandConfig,
    Event,
    FPFileLoader,
    LoadContext,
} from "./utils/types.js";
import { createContextBuilder } from "./utils/builder.js";
import { ApplicationCommandTypes, Interaction } from "discordeno";
import { File, executeWithMiddleware, MiddlewareFn } from "@discord-fp/core";

export type MenuInteraction = Interaction;

export type ContextCommandConfig<
    E extends MenuInteraction,
    Context
> = ApplicationCommandConfig & {
    execute: (e: Event<E, Context>) => void | Promise<void>;
};

export function createMenuCommandLoader<E extends MenuInteraction, Context>({
    config,
    type,
    listen,
}: {
    config: ContextCommandConfig<E, Context>;
    type: ApplicationCommandTypes.User | ApplicationCommandTypes.Message;
    listen: (
        listeners: ListenerModule,
        key: MenuCommandKey,
        callback: (e: E) => void
    ) => void;
}): MenuCommandLoader {
    return {
        middlewares: [],
        load({ name }: File, context: LoadContext): void | Promise<void> {
            const builder = createContextBuilder(name, config, type);

            context.commands.push(builder);

            listen(context.listeners, [name], (e) => {
                return executeWithMiddleware(e, this.middlewares, (event) =>
                    config.execute(event)
                );
            });
        },
    };
}

export interface MenuCommandLoader extends FPFileLoader {
    middlewares: MiddlewareFn<any, any, any>[];
}

export type MessageMenuCommandConfig<Context> = ContextCommandConfig<
    MenuInteraction,
    Context
>;

export type UserMenuCommandConfig<Context> = ContextCommandConfig<
    Interaction,
    Context
>;

export function createMessageMenuCommandLoader(
    config: MessageMenuCommandConfig<any>
) {
    return createMenuCommandLoader({
        config,
        type: ApplicationCommandTypes.Message,
        listen(listeners, key, callback) {
            listeners.message.set(key, callback);
        },
    });
}

export function createUserMenuCommandLoader(
    config: UserMenuCommandConfig<any>
) {
    return createMenuCommandLoader({
        config,
        type: ApplicationCommandTypes.User,
        listen(listeners, key, callback) {
            listeners.user.set(key, callback);
        },
    });
}
