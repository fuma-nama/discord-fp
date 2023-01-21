import { ContextCommandConfig, ContextCommandFile } from "./context";
import { ApplicationCommandType } from "discord.js";

export type UserCommandConfig = ContextCommandConfig;

export function user(config: UserCommandConfig) {
    return new UserCommandFile(config);
}

export class UserCommandFile extends ContextCommandFile {
    readonly config: UserCommandConfig;

    constructor(config: UserCommandConfig) {
        super(config, ApplicationCommandType.User);
        this.config = config;
    }
}
