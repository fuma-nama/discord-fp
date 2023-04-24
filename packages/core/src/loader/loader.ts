import type { Group, Node, File } from "./reader.js";

export type FileLoader<Context = unknown> = {
    load(self: File, context: Context): void | Promise<void>;
};

export type GroupLoader<Context = unknown> = {
    load(self: Group, context: Context): void | Promise<void>;
};

export async function loadNode<Context>(node: Node, context: Context) {
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
