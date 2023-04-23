import { ApplicationCommandTypes } from "discordeno";
import {
    ContextCommandConfig,
    MenuInteraction,
    createMenuCommandLoader,
} from "./context.js";

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
