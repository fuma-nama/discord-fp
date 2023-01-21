import {
    SharedSlashCommandOptions,
    SlashCommandSubcommandBuilder,
} from "discord.js";
import { parse } from "path";
import { CommandFile, LoadContext } from "../../core";
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

export class SlashCommandFile extends CommandFile {
    readonly config: SlashCommandConfig<any>;

    constructor(config: SlashCommandConfig<any>) {
        super();
        this.config = config;
    }

    override load(file: string, context: LoadContext) {
        const config = this.config;
        const { name } = parse(file);

        let command = createSlashBuilder(name, config);
        command = initOptions(command, config);

        context.client.application?.commands.create(command);
    }

    buildSubCommand(file: string): SlashCommandSubcommandBuilder {
        const config = this.config;
        const { name } = parse(file);

        let command = createBaseBuilder(
            new SlashCommandSubcommandBuilder(),
            name,
            config
        );
        command = initOptions(command, config);

        return command;
    }
}
