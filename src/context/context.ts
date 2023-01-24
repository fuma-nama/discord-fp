import {
    ContextMenuCommandInteraction,
    ContextMenuCommandType,
} from "discord.js";
import { FileLoader, LoadContext } from "../core";
import { ApplicationCommandConfig, File, Node } from "../types";
import { createContextBuilder } from "../utils";

export type ContextCommandConfig<E extends ContextMenuCommandInteraction> =
    ApplicationCommandConfig & {
        execute: (e: E) => void | Promise<void>;
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

    override load({ name }: File, context: LoadContext): void | Promise<void> {
        const config = this.config;
        const builder = createContextBuilder(name, config).setType(this.type);

        context.commands.push(builder);
        this.listen(builder.name, context);
    }

    abstract listen(name: string, context: LoadContext): void;
}
