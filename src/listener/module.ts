import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    Client,
    Interaction,
    MessageContextMenuCommandInteraction,
    UserContextMenuCommandInteraction,
} from "discord.js";
import { MessageContextCommandKey, UserContextCommandKey } from "./context.js";
import { SlashCommandKey } from "./slash.js";
import HashMap from "hashmap";
import { Middleware } from "@/middleware/index.js";
import { AutoCompleteKey } from "@/slash/options/base.js";

export class ListenerModule {
    private middleware?: Middleware;

    readonly slash = new ListenerMap<
        SlashCommandKey,
        ChatInputCommandInteraction
    >(this);
    readonly user = new ListenerMap<
        UserContextCommandKey,
        UserContextMenuCommandInteraction
    >(this);
    readonly message = new ListenerMap<
        MessageContextCommandKey,
        MessageContextMenuCommandInteraction
    >(this);
    readonly autoComplete = new ListenerMap<
        AutoCompleteKey,
        AutocompleteInteraction
    >(this);

    /**
     * Inject middleware into event listener
     */
    mapEventListener<E extends Interaction>(
        inner: (e: E) => void
    ): (e: E) => void {
        const middleware = this.middleware;

        return middleware == null ? inner : (e) => middleware(e, inner);
    }

    /**
     * Add middleware
     * @returns Function to remove middleware
     */
    withMiddleware(fn: Middleware): () => void {
        const prev = this.middleware;

        this.middleware = (e, handler) =>
            fn(e, prev != null ? (event) => prev(event, handler) : handler);

        return () => (this.middleware = prev);
    }

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
            const key: MessageContextCommandKey = [e.commandName];
            const handler = this.message.get(key);

            return handler?.(e);
        }

        if (e.isUserContextMenuCommand()) {
            const key: UserContextCommandKey = [e.commandName];
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

export class ListenerMap<K, E extends Interaction> {
    private inner = new HashMap<K, (e: E) => void>();
    readonly parent: ListenerModule;

    get(key: K) {
        return this.inner.get(key);
    }

    set(key: K, value: (e: E) => void) {
        this.inner.set(key, this.parent.mapEventListener(value));
    }

    constructor(parent: ListenerModule) {
        this.parent = parent;
    }
}
