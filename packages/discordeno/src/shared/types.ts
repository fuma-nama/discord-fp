import { Interaction } from "discordeno";
import { Localization, PermissionStrings } from "discordeno/types";

export type ApplicationCommandConfig = {
    name?: string;
    names?: Localization;

    /**
     * Permissions settings
     *
     * It will be ignored if used inside a command group
     */
    scope?: Partial<{
        /**
         * DM permissions
         */
        dm: boolean;

        /**
         * Member default permissions
         */
        member: PermissionStrings[];
    }>;
};

export type DescriptionConfig = {
    description: string;
    descriptions?: Localization;
};

export type Event<E extends Interaction, Context> = {
    event: E;
    ctx: Context;
};

export type AutocompleteInteraction = Interaction;
