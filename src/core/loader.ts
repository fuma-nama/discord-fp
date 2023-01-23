import { ListenerModule } from "@/listener/module";
import { Group, Node, Folder } from "@/types";
import { ApplicationCommandDataResolvable, Client } from "discord.js";
import { readDir } from "../utils";

export abstract class FileLoader {
    /**
     * @param self The node of current file
     * @param context
     */
    abstract load(self: Node, context: LoadContext): void | Promise<void>;
}

export abstract class GroupLoader extends FileLoader {
    abstract override load(
        self: Group,
        context: LoadContext
    ): void | Promise<void>;
}

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
            await node.meta.loader.load(node, context);
            break;
        }
    }

    console.log(`${node.path} had loaded Successfully`);
}

export async function loadDir(
    dir: string,
    context: LoadContext
): Promise<Folder | Group | undefined> {
    const node = await readDir(dir);
    await loadNode(node, context);

    return node;
}
