import { File } from "./utils/reader.js";
import { executeWithMiddleware, MiddlewareFn } from "@/core/middleware.js";
import { MenuCommandKey } from "@/listener/keys.js";
import { ListenerModule } from "@/listener/module.js";
import { FileLoader, LoadContext } from "./utils/loader.js";
import { ApplicationCommandConfig, Event } from "./utils/types.js";
import { createContextBuilder } from "./utils/builder.js";
import { ApplicationCommandTypes, Interaction } from "discordeno";

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
        type: "file",
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

export interface MenuCommandLoader extends FileLoader {
    middlewares: MiddlewareFn<any, any>[];
}

export type MessageMenuCommandConfig<Context> = ContextCommandConfig<
    MenuInteraction,
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

export type UserMenuCommandConfig<Context> = ContextCommandConfig<
    Interaction,
    Context
>;

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
