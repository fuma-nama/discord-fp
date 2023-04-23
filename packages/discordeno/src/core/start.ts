import { readNode, Node } from "@/shared/reader.js";
import { resolve } from "path";
import { LoadContext, loadNode } from "../shared/loader.js";
import { registerCommands, RegisterOptions } from "./register.js";
import { Bot } from "discordeno";
import { ListenerModule } from "@/index.js";

export type StartOptions = {
    bot: Bot;

    /**
     * Where to load commands (path or node, relative path is allowed)
     */
    load: (Node | string)[];

    register?: RegisterOptions;

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
export async function start(options: StartOptions): Promise<StartResult> {
    let context = options.defaultContext ?? {
        commands: [],
        listeners: new ListenerModule(),
    };

    console.time(ready);
    const loaded: Node[] = [];

    console.log("Loading commands...");

    for (const target of options.load) {
        loaded.push(await load(target, context));
    }

    await registerCommands(options.bot, context.commands, options.register);

    console.log("Loading event listeners...");
    options.bot.events["interactionCreate"] = context.listeners.handle;

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
