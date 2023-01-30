import { LoadContext } from "./loader.js";

export type RegisterConfig = {
    /**
     * if disabled, Skip registering commands
     *
     * default: true
     */
    enabled?: boolean;
};

/**
 * Register commands
 */
export async function registerCommands(
    config: RegisterConfig | null | undefined,
    context: LoadContext
) {
    const register = {
        enabled: config?.enabled ?? true,
    };

    if (register.enabled === true) {
        const application = context.client.application;
        console.log("Registering commands...");

        if (application == null)
            throw new Error("Client is not ready to register commands");

        await application.commands.set(context.commands);
    } else {
        console.log("Commands registration skipped");
    }
}
