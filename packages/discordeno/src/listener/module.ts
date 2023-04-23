import {
    Interaction,
    InteractionTypes,
    EventHandlers,
    ApplicationCommandOptionTypes,
    ApplicationCommandTypes,
} from "discordeno";
import { MenuCommandKey, SlashCommandKey, AutoCompleteKey } from "./keys.js";
import HashMap from "hashmap";
import { AutocompleteInteraction, MenuInteraction } from "@/index.js";

type Listener<E> = (event: E) => void | Promise<void>;

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
    readonly handle: EventHandlers["interactionCreate"] = (_, interaction) => {
        if (interaction.data == null) return;

        //waiting for https://github.com/discordeno/discordeno/pull/2987
        const e = interaction as Interaction & {
            data: {
                type: ApplicationCommandTypes;
            };
        };
        e.data.type = e.data.type ?? ApplicationCommandTypes.ChatInput;

        if (
            e.type === InteractionTypes.ApplicationCommand &&
            e.data.type === ApplicationCommandTypes.ChatInput
        ) {
            let key: SlashCommandKey;

            if (
                e.data.options?.[0].type ===
                ApplicationCommandOptionTypes.SubCommandGroup
            ) {
                const group = e.data.options[0];

                if (
                    group.options?.[0]?.type ===
                    ApplicationCommandOptionTypes.SubCommand
                ) {
                    key = [e.data.name, group.name, group.options[0].name];
                } else {
                    key = [e.data.name, group.name, null];
                }
            } else if (
                e.data.options?.[0].type ===
                ApplicationCommandOptionTypes.SubCommand
            ) {
                const subcommand = e.data.options[0];

                key = [e.data.name, null, subcommand.name];
            } else {
                key = [e.data.name, null, null];
            }

            const handler = this.slash.get(key);

            if (handler != null) {
                return handler?.(e);
            }
        }

        if (e.type === InteractionTypes.ApplicationCommand) {
            const key: MenuCommandKey = [e.data.name];
            const handler =
                e.data.type === ApplicationCommandTypes.Message
                    ? this.message.get(key)
                    : this.user.get(key);

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
