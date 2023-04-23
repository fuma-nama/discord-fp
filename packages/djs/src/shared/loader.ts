import { ListenerModule } from "@/listener/module.js";
import type { Group, Node, File } from "@/shared/reader.js";
import { ApplicationCommandDataResolvable, Client } from "discord.js";

export type NodeLoader = FileLoader | GroupLoader;

export type FileLoader = {
    type: "file";
    load(self: File, context: LoadContext): void | Promise<void>;
};

export type GroupLoader = {
    type: "group";
    load(self: Group, context: LoadContext): void | Promise<void>;
};

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
            if (node.meta.loader != null) {
                await node.meta.loader.load(node, context);
            } else {
                for (const child of node.nodes) {
                    await loadNode(child, context);
                }
            }

            break;
        }
    }

    console.log(`${node.path} had loaded Successfully`);
}
