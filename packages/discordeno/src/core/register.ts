import {
    Bot,
    upsertGlobalApplicationCommands,
    upsertGuildApplicationCommands,
} from "discordeno";
import { LoadContext } from "../utils/loader.js";

export type RegisterOptions = {
    /**
     * if disabled, Skip registering commands
     *
     * default: true
     */
    enabled?: boolean;

    /**
     * Register commands on guild
     */
    guilds?: string[];

    /**
     * Skip registering global commands
     *
     * default: false
     */
    guildsOnly?: boolean;
};

/**
 * Register commands
 */
export async function registerCommands(
    bot: Bot,
    commands: LoadContext["commands"],
    options?: RegisterOptions
) {
    const register = {
        enabled: options?.enabled ?? true,
        guilds: options?.guilds ?? [],
        guildsOnly: options?.guildsOnly ?? false,
    };

    if (!register.enabled) {
        console.log("Commands registration skipped");
        return;
    }

    console.log("Registering commands...");

    if (!register.guildsOnly) {
        await upsertGlobalApplicationCommands(bot, commands);
        console.log("Registered on global");
    }

    for (const guildId of register.guilds) {
        await upsertGuildApplicationCommands(bot, guildId, commands);

        console.log(`Registered on guild ${guildId}`);
    }
}
