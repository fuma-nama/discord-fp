import { readNode } from "@/index.js";
import { ListenerModule } from "@/listener/module.js";
import { Node } from "@/types.js";
import { Client } from "discord.js";
import { resolve } from "path";
import { LoadContext, loadNode } from "./loader.js";
import { registerCommands, RegisterConfig } from "./register.js";

type Config = {
    /**
     * Where to load commands (path or node, relative path is allowed)
     */
    load: (Node | string)[];

    register?: RegisterConfig;

    /**
     * override default load context
     */
    defaultContext?: LoadContext;
};

const ready = "Ready";

/**
 * Start and register commands
 */
export async function start(
    client: Client,
    config: Config
): Promise<LoadContext> {
    console.time(ready);
    const context: LoadContext = config.defaultContext ?? {
        client,
        commands: [],
        listeners: new ListenerModule(),
    };

    console.log("Loading commands...");
    for (const target of config.load) {
        await load(target, context);
    }

    await registerCommands(config.register, context);

    console.log("Loading event listeners...");
    context.listeners.load(context.client);

    console.timeEnd(ready);
    return context;
}

async function load(target: string | Node, context: LoadContext) {
    if (typeof target === "string") {
        const node = await readNode(resolve(target));

        await loadNode(node, context);
    } else {
        await loadNode(target, context);
    }
}
