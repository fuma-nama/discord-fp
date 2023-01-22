import { ContextMenuCommandType } from "discord.js";
import { parse } from "path";
import { FileLoader, LoadContext } from "../core";
import { ApplicationCommandConfig, Node } from "../types";
import { createContextBuilder } from "../utils";

export type ContextCommandConfig = ApplicationCommandConfig;

export abstract class ContextCommandFile extends FileLoader {
    readonly config: ContextCommandConfig;
    readonly type: ContextMenuCommandType;

    constructor(config: ContextCommandConfig, type: ContextMenuCommandType) {
        super();
        this.config = config;
        this.type = type;
    }

    override load({ path }: Node, context: LoadContext): void | Promise<void> {
        const config = this.config;
        const { name } = parse(path);
        const builder = createContextBuilder(name, config).setType(this.type);

        context.commands.push(builder);
    }
}
