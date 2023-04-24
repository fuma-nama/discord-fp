import { ListenerModule } from "@/index.js";
import { CreateApplicationCommand } from "discordeno";
import { FileLoader, GroupLoader } from "@discord-fp/core";
import { Interaction } from "discordeno";
import { Localization, PermissionStrings } from "discordeno/types";

export type FPFileLoader = FileLoader<LoadContext>;

export type FPGroupLoader = GroupLoader<LoadContext>;

/**
 * Used for loading command, You may extend this type
 */
export interface LoadContext {
    listeners: ListenerModule;
    commands: CreateApplicationCommand[];
}

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
