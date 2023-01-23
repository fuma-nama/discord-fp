import { LoadContext } from "@/core";
import {
    ApplicationCommandType,
    MessageContextMenuCommandInteraction,
} from "discord.js";
import { ContextCommandConfig, ContextCommandFile } from "./context";

export type MessageCommandConfig =
    ContextCommandConfig<MessageContextMenuCommandInteraction>;

export function message(config: MessageCommandConfig) {
    return new MessageCommandFile(config);
}

export class MessageCommandFile extends ContextCommandFile<MessageContextMenuCommandInteraction> {
    readonly config: MessageCommandConfig;

    constructor(config: MessageCommandConfig) {
        super(config, ApplicationCommandType.Message);
        this.config = config;
    }

    override listen(name: string, context: LoadContext) {
        context.listeners.message.set([name], (e) => this.config.execute(e));
    }
}
