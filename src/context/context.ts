import {
    ContextMenuCommandInteraction,
    ContextMenuCommandType,
} from "discord.js";
import { parse } from "path";
import { FileLoader, LoadContext } from "../core";
import { ApplicationCommandConfig, Node } from "../types";
import { createContextBuilder } from "../utils";

export type ContextCommandConfig<E extends ContextMenuCommandInteraction> =
    ApplicationCommandConfig & {
        execute: (e: E) => void;
    };

export abstract class ContextCommandFile<
    E extends ContextMenuCommandInteraction
> extends FileLoader {
    readonly config: ContextCommandConfig<E>;
    readonly type: ContextMenuCommandType;

    constructor(config: ContextCommandConfig<E>, type: ContextMenuCommandType) {
        super();
        this.config = config;
        this.type = type;
    }

    override load({ path }: Node, context: LoadContext): void | Promise<void> {
        const config = this.config;
        const { name } = parse(path);
        const builder = createContextBuilder(name, config).setType(this.type);

        context.commands.push(builder);
        this.listen(builder.name, context);
    }

    abstract listen(name: string, context: LoadContext);
}
