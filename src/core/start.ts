import { ListenerModule } from "@/listener/module.js";
import { Client } from "discord.js";
import { LoadContext, loadDir } from "./loader.js";

export type Config = {
    /**
     * where to load commands
     */
    dir: string | string[];
    register?: {
        /**
         * if disabled, Skip registering commands
         *
         * default: true
         */
        enabled?: boolean;
    };
};

const ready = "Ready";

export async function start(client: Client, config: Config) {
    const context: LoadContext = {
        client,
        commands: [],
        listeners: new ListenerModule(),
    };
    console.time(ready);

    console.log("Loading commands...");
    const load = Array.isArray(config.dir) ? config.dir : [config.dir];
    for (const dir of load) {
        await loadDir(dir, context);
    }

    await registerCommands(config, context);

    console.log("Loading event listeners...");
    context.listeners.load(client);

    console.timeEnd(ready);
}

async function registerCommands(config: Config, context: LoadContext) {
    const register = {
        enabled: config.register?.enabled ?? true,
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
