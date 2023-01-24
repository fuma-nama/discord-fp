import {
    ChatInputCommandInteraction,
    SharedSlashCommandOptions,
    SlashCommandSubcommandBuilder,
} from "discord.js";
import { parse } from "path";
import { FileLoader, LoadContext } from "../../core";
import { Node } from "../../types";
import { createSlashBuilder, createBaseBuilder } from "../../utils";
import { Option } from "../options";
import { SlashCommandConfig } from "../slash";

function initOptions<B extends SharedSlashCommandOptions>(
    builder: B,
    config: SlashCommandConfig<any>
): B {
    const options = config.options ?? {};

    for (const [name, info] of Object.entries<Option<any, any>>(options)) {
        builder.options.push(info.build(name));
    }

    return builder;
}

export class SlashCommandFile extends FileLoader {
    readonly config: SlashCommandConfig<any>;
    readonly optionMap: [string, Option<unknown, boolean>][];

    constructor(config: SlashCommandConfig<any>) {
        super();
        this.config = config;
        this.optionMap = Object.entries<Option<unknown, boolean>>(
            this.config.options
        );
    }

    onEvent = (e: ChatInputCommandInteraction) => {
        const options: any = {};

        for (const [key, option] of this.optionMap) {
            const v = e.options.get(key, option.config.required);

            options[key] = option.parse(v);
        }
        this.config.execute({
            event: e,
            options: options,
        });
    };

    override load({ path }: Node, context: LoadContext) {
        const config = this.config;
        const { name } = parse(path);

        let command = createSlashBuilder(name, config);
        command = initOptions(command, config);

        context.listeners.slash.set([command.name, null, null], this.onEvent);
        context.commands.push(command);
    }

    buildSubCommand(self: Node): SlashCommandSubcommandBuilder {
        const config = this.config;
        const { name } = parse(self.path);

        let command = createBaseBuilder(
            new SlashCommandSubcommandBuilder(),
            name,
            config
        );
        command = initOptions(command, config);

        return command;
    }
}
