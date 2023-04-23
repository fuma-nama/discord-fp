import { Node } from "@/shared/reader.js";

export function debugNode(node: Node, message: string) {
    console.debug(`${node.path} (${node.type})`, message);
}
