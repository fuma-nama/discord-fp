import { ListenerModule } from "@/listener/module";
import { Client } from "discord.js";
import { LoadContext, loadDir } from "./loader";

export type Config = {
    dir: string;
    skipRegister?: boolean;
};

const ready = "Ready";

export async function start(client: Client, config: Config) {
    const context: LoadContext = {
        client,
        commands: [],
        listeners: new ListenerModule(),
    };
    console.time(ready);

    await loadDir(config.dir, context);

    if (config.skipRegister !== true) {
        const application = context.client.application;
        console.log("Registering commands...");

        if (application == null)
            throw new Error("Client is not ready to register commands");

        for (const command of context.commands) {
            await application.commands.create(command);
        }
    }

    console.log("Loading event listeners...");
    context.listeners.load(client);

    console.timeEnd(ready);
}
