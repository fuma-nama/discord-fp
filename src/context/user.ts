import { ContextCommandConfig, ContextCommandFile } from "./context";
import {
    ApplicationCommandType,
    UserContextMenuCommandInteraction,
} from "discord.js";
import { LoadContext } from "@/core";

export type UserCommandConfig =
    ContextCommandConfig<UserContextMenuCommandInteraction>;

export function user(config: UserCommandConfig) {
    return new UserCommandFile(config);
}

export class UserCommandFile extends ContextCommandFile<UserContextMenuCommandInteraction> {
    readonly config: UserCommandConfig;

    constructor(config: UserCommandConfig) {
        super(config, ApplicationCommandType.User);
        this.config = config;
    }

    listen(name: string, context: LoadContext) {
        context.listeners.user.set([name], (e) => this.config.execute(e));
    }
}
