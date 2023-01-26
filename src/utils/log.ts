import { Node } from "@/types.js";

export function debugNode(node: Node, message: string) {
    console.debug(`${node.path} (${node.type})`, message);
}
