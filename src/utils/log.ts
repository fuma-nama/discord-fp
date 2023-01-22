import createLogger from "pino";
import { Node } from "@types";

export const logger = createLogger({
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
        },
    },
});

export function logNode(node: Node, message: string) {
    logger.info(node, message);
}
