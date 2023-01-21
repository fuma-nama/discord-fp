import { ApplicationCommandType } from "discord.js";
import { ContextCommandConfig, ContextCommandFile } from "./context";

export type MessageCommandConfig = ContextCommandConfig;

export function message(config: MessageCommandConfig) {
    return new MessageCommandFile(config);
}

export class MessageCommandFile extends ContextCommandFile {
    readonly config: MessageCommandConfig;

    constructor(config: MessageCommandConfig) {
        super(config, ApplicationCommandType.Message);
        this.config = config;
    }
}
