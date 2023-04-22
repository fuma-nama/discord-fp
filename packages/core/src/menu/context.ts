import { executeWithMiddleware, MiddlewareFn } from "@/core/middleware.js";
import { MenuCommandKey } from "@/listener/keys.js";
import { ListenerModule } from "@/listener/module.js";
import {
    ContextMenuCommandType,
    MessageContextMenuCommandInteraction,
    UserContextMenuCommandInteraction,
} from "discord.js";
import { FileLoader, LoadContext } from "../shared/loader.js";
import { ApplicationCommandConfig, Event } from "../shared/types.js";
import { createContextBuilder } from "../internal/builder.js";
import type { File } from "@/shared/reader.js";

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
