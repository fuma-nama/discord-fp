import {
    ApplicationCommandType,
    MessageContextMenuCommandInteraction,
} from "discord.js";
import { ContextCommandConfig, createMenuCommandLoader } from "./context.js";

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
