import type { Interaction, LocalizationMap } from "discord.js";

export type ApplicationCommandConfig = {
    name?: string;
    names?: LocalizationMap;

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
        member: number | string | bigint;
    }>;
};

export type DescriptionConfig = {
    description: string;
    descriptions?: LocalizationMap;
};

export type Event<E extends Interaction, Context> = {
    event: E;
    ctx: Context;
};
