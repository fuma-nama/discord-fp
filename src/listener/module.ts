import {
    ChatInputCommandInteraction,
    Client,
    MessageContextMenuCommandInteraction,
    UserContextMenuCommandInteraction,
} from "discord.js";
import { MessageContextCommandKey, UserContextCommandKey } from "./context";
import { SlashCommandKey } from "./slash";
import HashMap from "hashmap";

export class ListenerModule {
    readonly slash = new HashMap<
        SlashCommandKey,
        (e: ChatInputCommandInteraction) => void
    >();
    readonly user = new HashMap<
        UserContextCommandKey,
        (e: UserContextMenuCommandInteraction) => void
    >();
    readonly message = new HashMap<
        MessageContextCommandKey,
        (e: MessageContextMenuCommandInteraction) => void
    >();

    load(client: Client) {
        client.on("interactionCreate", (e) => {
            if (e.isChatInputCommand()) {
                const key: SlashCommandKey = [
                    e.commandName,
                    e.options.getSubcommandGroup(),
                    e.options.getSubcommand(),
                ];
                const handler = this.slash.get(key);

                if (handler == null) {
                    console.warn("Unhandled command", key, this.slash.keys());
                }
                return handler?.(e);
            }

            if (e.isMessageContextMenuCommand()) {
                const key: MessageContextCommandKey = [e.commandName];
                const handler = this.message.get(key);

                return handler?.(e);
            }

            if (e.isUserContextMenuCommand()) {
                const key: UserContextCommandKey = [e.commandName];
                const handler = this.user.get(key);

                return handler?.(e);
            }
        });
    }
}

export default ListenerModule;
