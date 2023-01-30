import { readNode } from "@/index.js";
import { ListenerModule } from "@/listener/module.js";
import { Node } from "@/types.js";
import { Client } from "discord.js";
import { resolve } from "path";
import { LoadContext, loadNode } from "./loader.js";
import { registerCommands, RegisterConfig } from "./register.js";

type Config = {
    /**
     * where to load commands
     */
    dir: string | string[];
    register?: RegisterConfig;
};

/**
 * Start and register commands
 */
export async function start(
    client: Client,
    config: Config
): Promise<LoadContext> {
    const context: LoadContext = {
        client,
        commands: [],
        listeners: new ListenerModule(),
    };
    const nodes: Node[] = [];
    const scan = Array.isArray(config.dir) ? config.dir : [config.dir];

    console.log("Scanning files...");
    for (const dir of scan) {
        nodes.push(await readNode(resolve(dir)));
    }

    return await startBase({
        register: config.register,
        context,
        nodes,
    });
}

type BaseConfig = {
    /**
     * Nodes to load
     */
    nodes: Node[];

    register?: RegisterConfig;
    context: LoadContext;
};

/**
 * Start and register commands
 */
export async function startBase({
    register: config,
    nodes,
    context,
}: BaseConfig) {
    const ready = "Ready";

    console.time(ready);
    console.log("Loading commands...");
    for (const node of nodes) {
        await loadNode(node, context);
    }

    await registerCommands(config, context);

    console.log("Loading event listeners...");
    context.listeners.load(context.client);

    console.timeEnd(ready);

    return context;
}
