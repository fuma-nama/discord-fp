import { Event } from "@/types.js";
import { executeWithMiddleware, MiddlewareFn } from "@/builder/middleware.js";
import { MenuCommandKey } from "@/listener/keys.js";
import { ListenerModule } from "@/listener/module.js";
import {
    ContextMenuCommandType,
    MessageContextMenuCommandInteraction,
    UserContextMenuCommandInteraction,
} from "discord.js";
import { FileLoader, LoadContext } from "../core/loader.js";
import { ApplicationCommandConfig, File } from "../types.js";
import { createContextBuilder } from "../utils/builder.js";

type MenuInteraction =
    | UserContextMenuCommandInteraction
    | MessageContextMenuCommandInteraction;

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
    type: ContextMenuCommandType;
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

export interface MenuCommandLoader extends FileLoader {
    middlewares: MiddlewareFn<any, any>[];
}
