import { ListenerModule } from "@/listener/module.js";
import { Group, Node, File } from "@/types.js";
import { ApplicationCommandDataResolvable, Client } from "discord.js";

export abstract class NodeLoader<T extends Node> {
    /**
     * @param self The node of current file
     * @param context
     */
    abstract load(self: T, context: LoadContext): void | Promise<void>;
}

export abstract class FileLoader extends NodeLoader<File> {}

export abstract class GroupLoader extends NodeLoader<Group> {}

/**
 * Used for loading commands
 */
export type LoadContext = {
    client: Client;
    commands: ApplicationCommandDataResolvable[];
    listeners: ListenerModule;
};

export async function loadNode(node: Node, context: LoadContext) {
    switch (node.type) {
        case "file": {
            await node.loader.load(node, context);
            break;
        }
        case "folder": {
            for (const child of node.nodes) {
                await loadNode(child, context);
            }

            break;
        }
        case "group": {
            let removeMiddleware: (() => void) | null = null;

            if (node.meta.middleware != null) {
                removeMiddleware = context.listeners.withMiddleware(
                    node.meta.middleware
                );
            }

            if (node.meta.loader != null) {
                await node.meta.loader.load(node, context);
            } else {
                for (const child of node.nodes) {
                    await loadNode(child, context);
                }
            }

            removeMiddleware?.();
            break;
        }
    }

    console.log(`${node.path} had loaded Successfully`);
}
