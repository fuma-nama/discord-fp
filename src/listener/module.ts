import {
    ChatInputCommandInteraction,
    Client,
    MessageContextMenuCommandInteraction,
    UserContextMenuCommandInteraction,
} from "discord.js";
import { MessageContextCommandKey, UserContextCommandKey } from "./context";
import { SlashCommandKey } from "./slash";
import HashMap from "hashmap";
import { Middleware } from "@/middleware";

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

    withMiddleware(fn: Middleware | null): {
        child: ListenerModule;
        resolve: () => void;
    } {
        if (fn == null) {
            return {
                child: this,
                resolve: () => {},
            };
        }

        const child = new ListenerModule();
        const self = this;
        return {
            child,
            resolve() {
                for (const [key, handler] of child.slash.entries()) {
                    self.slash.set(key, (e) => fn(e, handler));
                }

                for (const [key, handler] of child.user.entries()) {
                    self.user.set(key, (e) => fn(e, handler));
                }

                for (const [key, handler] of child.message.entries()) {
                    self.message.set(key, (e) => fn(e, handler));
                }
            },
        };
    }

    load(client: Client) {
        client.on("interactionCreate", (e) => {
            if (e.isChatInputCommand()) {
                const key: SlashCommandKey = [
                    e.commandName,
                    e.options.getSubcommandGroup(false),
                    e.options.getSubcommand(false),
                ];

                const handler = this.slash.get(key);

                if (handler == null) {
                    console.warn(
                        "Unhandled slash command",
                        key,
                        this.slash.keys()
                    );
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
