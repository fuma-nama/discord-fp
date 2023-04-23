import { ApplicationCommandTypes, Interaction } from "discordeno";
import { ContextCommandConfig, createMenuCommandLoader } from "./context.js";

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
