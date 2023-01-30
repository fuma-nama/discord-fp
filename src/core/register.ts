import { LoadContext } from "./loader.js";

export type RegisterConfig = {
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
    config: RegisterConfig | null | undefined,
    context: LoadContext
) {
    const application = context.client.application;
    const register = {
        enabled: config?.enabled ?? true,
        guilds: config?.guilds ?? [],
        guildsOnly: config?.guildsOnly ?? false,
    };

    if (!register.enabled) {
        console.log("Commands registration skipped");
        return;
    }

    if (application == null) {
        throw new Error("Client is not ready to register commands");
    }

    console.log("Registering commands...");

    if (!register.guildsOnly) {
        await application.commands.set(context.commands);
        console.log("Registered on global");
    }

    for (const guildId of register.guilds) {
        const guild = await application.client.guilds.fetch(guildId);

        if (guild == null) {
            throw new Error(`Failed to find guild ${guildId}`);
        }

        await guild.commands.set(context.commands);
        console.log(`Registered on guild ${guildId} (${guild.name})`);
    }
}
