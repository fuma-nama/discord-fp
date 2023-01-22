import { Client } from "discord.js";
import { LoadContext, loadDir } from "./loader";
import chalk from "chalk";

export type Config = {
    dir: string;
};

const ready = "Ready";

export async function start(client: Client, config: Config) {
    const context: LoadContext = { client, commands: [] };
    console.time(ready);

    await loadDir(config.dir, context);

    console.log(chalk.yellow("Registering commands..."));

    const application = context.client.application;

    if (application == null)
        throw new Error("Client is not ready to register commands");

    for (const command of context.commands) {
        await application.commands.create(command);
    }

    console.timeEnd(ready);
}
