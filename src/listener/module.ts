import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    Client,
    Interaction,
    MessageContextMenuCommandInteraction,
    UserContextMenuCommandInteraction,
} from "discord.js";
import { MenuCommandKey, SlashCommandKey, AutoCompleteKey } from "./keys.js";
import HashMap from "hashmap";

type Listener<E> = (event: E) => void | Promise<void>;

export class ListenerModule {
    readonly slash = new HashMap<
        SlashCommandKey,
        Listener<ChatInputCommandInteraction>
    >();
    readonly user = new HashMap<
        MenuCommandKey,
        Listener<UserContextMenuCommandInteraction>
    >();
    readonly message = new HashMap<
        MenuCommandKey,
        Listener<MessageContextMenuCommandInteraction>
    >();
    readonly autoComplete = new HashMap<
        AutoCompleteKey,
        Listener<AutocompleteInteraction>
    >();

    /**
     * Handle interaction event
     */
    readonly handle = (e: Interaction) => {
        if (e.isChatInputCommand()) {
            const key: SlashCommandKey = [
                e.commandName,
                e.options.getSubcommandGroup(false),
                e.options.getSubcommand(false),
            ];

            const handler = this.slash.get(key);

            return handler?.(e);
        }

        if (e.isMessageContextMenuCommand()) {
            const key: MenuCommandKey = [e.commandName];
            const handler = this.message.get(key);

            return handler?.(e);
        }

        if (e.isUserContextMenuCommand()) {
            const key: MenuCommandKey = [e.commandName];
            const handler = this.user.get(key);

            return handler?.(e);
        }

        if (e.isAutocomplete()) {
            const key: AutoCompleteKey = [
                [
                    e.commandName,
                    e.options.getSubcommandGroup(false),
                    e.options.getSubcommand(false),
                ],
                e.options.getFocused(true).name,
            ];

            const handler = this.autoComplete.get(key);

            return handler?.(e);
        }
    };

    /**
     * Add listener
     */
    load(client: Client) {
        client.on("interactionCreate", this.handle);
    }

    /**
     * Remove listener
     */
    unload(client: Client) {
        client.removeListener("interactionCreate", this.handle);
    }
}
