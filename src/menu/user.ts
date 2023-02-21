import { ContextCommandConfig, createMenuCommandLoader } from "./context.js";
import {
    ApplicationCommandType,
    UserContextMenuCommandInteraction,
} from "discord.js";

export type UserMenuCommandConfig<Context> = ContextCommandConfig<
    UserContextMenuCommandInteraction,
    Context
>;

export function user(config: UserMenuCommandConfig<any>) {
    return createMenuCommandLoader({
        config,
        type: ApplicationCommandType.User,
        listen(listeners, key, callback) {
            listeners.user.set(key, callback);
        },
    });
}
