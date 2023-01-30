import { ListenerModule } from "@/listener/module.js";
import { Group, Node, Folder, File } from "@/types.js";
import { ApplicationCommandDataResolvable, Client } from "discord.js";
import { readDir } from "@/utils/file.js";

export abstract class NodeLoader<T extends Node> {
    /**
     * @param self The node of current file
     * @param context
     */
    abstract load(self: T, context: LoadContext): void | Promise<void>;
}

export abstract class FileLoader extends NodeLoader<File> {}

export abstract class GroupLoader extends NodeLoader<Group> {}

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
            const { child: listeners, resolve } =
                context.listeners.withMiddleware(node.meta.middleware ?? null);

            if (node.meta.loader != null) {
                await node.meta.loader.load(node, { ...context, listeners });
                resolve();

                break;
            }

            for (const child of node.nodes) {
                await loadNode(child, { ...context, listeners });
                resolve();

                break;
            }
        }
    }

    console.log(`${node.path} had loaded Successfully`);
}
