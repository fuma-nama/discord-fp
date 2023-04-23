import {
    ApplicationCommandTypes,
    Interaction,
    InteractionTypes,
    EventHandlers,
    ApplicationCommandOptionTypes,
} from "discordeno";
import { MenuCommandKey, SlashCommandKey, AutoCompleteKey } from "./keys.js";
import HashMap from "hashmap";
import { AutocompleteInteraction, MenuInteraction } from "@/index.js";

type Listener<E> = (event: E) => void | Promise<void>;

type a = EventHandlers["interactionCreate"];
export class ListenerModule {
    readonly slash = new HashMap<SlashCommandKey, Listener<Interaction>>();
    readonly user = new HashMap<MenuCommandKey, Listener<MenuInteraction>>();
    readonly message = new HashMap<MenuCommandKey, Listener<MenuInteraction>>();
    readonly autoComplete = new HashMap<
        AutoCompleteKey,
        Listener<AutocompleteInteraction>
    >();

    /**
     * Handle interaction event
     */
    readonly handle: EventHandlers["interactionCreate"] = (_, e) => {
        if (e.data == null) return;

        console.log(e);

        if (
            e.type === InteractionTypes.ApplicationCommand &&
            "type" in e.data &&
            e.data.type === ApplicationCommandTypes.ChatInput
        ) {
            const subcommandGroup = e.data.options?.find(
                (o) => o.type === ApplicationCommandOptionTypes.SubCommandGroup
            );
            const subcommad = e.data.options?.find(
                (o) => o.type === ApplicationCommandOptionTypes.SubCommand
            );

            const key: SlashCommandKey = [
                e.data.name,
                subcommandGroup?.name ?? null,
                subcommad?.name ?? null,
            ];

            const handler = this.slash.get(key);

            return handler?.(e);
        }

        if (
            e.type === InteractionTypes.ApplicationCommand &&
            "type" in e.data &&
            (e.data.type === ApplicationCommandTypes.Message ||
                e.data.type === ApplicationCommandTypes.User)
        ) {
            const key: MenuCommandKey = [e.data.name];
            const handler = this.message.get(key);

            return handler?.(e);
        }

        if (e.type === InteractionTypes.ApplicationCommandAutocomplete) {
            const subcommandGroup = e.data.options?.find(
                (o) => o.type === ApplicationCommandOptionTypes.SubCommandGroup
            );
            const subcommad = e.data.options?.find(
                (o) => o.type === ApplicationCommandOptionTypes.SubCommand
            );
            const focused = e.data.options?.find((o) => o.focused === true);

            if (focused == null) return;

            const key: AutoCompleteKey = [
                [
                    e.data.name,
                    subcommandGroup?.name ?? null,
                    subcommad?.name ?? null,
                ],
                focused.name,
            ];

            const handler = this.autoComplete.get(key);

            return handler?.(e);
        }
    };
}
