import {
    ContextMenuCommandInteraction,
    ContextMenuCommandType,
} from "discord.js";
import { FileLoader, LoadContext } from "../core/loader.js";
import { ApplicationCommandConfig, File, Node } from "../types.js";
import { createContextBuilder } from "../utils/builder.js";

export type ContextCommandConfig<E extends ContextMenuCommandInteraction> =
    ApplicationCommandConfig & {
        execute: (e: E) => void | Promise<void>;
    };

export abstract class ContextCommandFile<
    E extends ContextMenuCommandInteraction
> implements FileLoader {
    readonly config: ContextCommandConfig<E>;
    readonly type: ContextMenuCommandType;

    constructor(config: ContextCommandConfig<E>, type: ContextMenuCommandType) {
        this.config = config;
        this.type = type;
    }

    load({ name }: File, context: LoadContext): void | Promise<void> {
        const config = this.config;
        const builder = createContextBuilder(name, config).setType(this.type);

        context.commands.push(builder);
        this.listen(builder.name, context);
    }

    abstract listen(name: string, context: LoadContext): void;
}
