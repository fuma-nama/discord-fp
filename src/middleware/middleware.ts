import { Interaction } from "discord.js";

export type Middleware = (
    e: Interaction,
    handler: (e: Interaction) => void | Promise<void>
) => void;
