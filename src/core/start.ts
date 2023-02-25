import { readNode, Node } from "@/shared/reader.js";
import { ListenerModule } from "@/listener/module.js";
import { Client } from "discord.js";
import { resolve } from "path";
import { LoadContext, loadNode } from "../shared/loader.js";
import { registerCommands, RegisterConfig } from "./register.js";

export type StartOptions = {
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

export type StartResult = {
    context: LoadContext;
    loaded: Node[];
};

const ready = "Ready";

/**
 * Start and register commands
 */
export async function start(
    client: Client,
    options: StartOptions
): Promise<StartResult> {
    console.time(ready);
    const loaded: Node[] = [];
    const context: LoadContext = options.defaultContext ?? {
        client,
        commands: [],
        listeners: new ListenerModule(),
    };

    console.log("Loading commands...");

    for (const target of options.load) {
        loaded.push(await load(target, context));
    }

    await registerCommands(options.register, context);

    console.log("Loading event listeners...");
    context.listeners.load(context.client);

    console.timeEnd(ready);
    return {
        context,
        loaded,
    };
}

async function load(
    target: string | Node,
    context: LoadContext
): Promise<Node> {
    if (typeof target === "string") {
        const node = await readNode(resolve(target));

        await loadNode(node, context);
        return node;
    } else {
        await loadNode(target, context);
        return target;
    }
}
