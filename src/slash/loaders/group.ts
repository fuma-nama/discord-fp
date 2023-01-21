import fs, { lstatSync } from "fs";
import { SlashCommandSubcommandGroupBuilder } from "discord.js";
import { parse, join } from "path";
import { MetaFile, LoadContext } from "../../core";
import {
    createSlashBuilder,
    readFileOrMeta,
    createBaseBuilder,
} from "../../utils";
import { SlashCommandFile } from "./file";
import { GroupMetaConfig } from "../slash";

export class SlashCommandGroupFile extends MetaFile {
    readonly config: GroupMetaConfig;

    constructor(config: GroupMetaConfig) {
        super();
        this.config = config;
    }

    override async load(path: string, context: LoadContext) {
        const config = this.config;
        const { dir, base, name } = parse(path);

        const command = createSlashBuilder(name, config);
        const files = fs.readdirSync(dir).filter((file) => file !== base);

        for (var file of files) {
            file = join(dir, file);

            const { type, data } = await readFileOrMeta(file);

            if (type === "file") {
                command.addSubcommand(
                    (data as SlashCommandFile).buildSubCommand(file)
                );
                console.log("Subcommand Loaded", file);

                continue;
            }

            if (type === "meta") {
                command.addSubcommandGroup(
                    await (data as SlashCommandGroupFile).buildSubCommandGroup(
                        file
                    )
                );
                console.log("Subcommand Group Loaded", file);
                continue;
            }

            throw new Error(`Invalid file ${file}`);
        }

        context.client.application?.commands.create(command);
    }

    async buildSubCommandGroup(path: string) {
        const config = this.config;
        const { dir, base, name } = parse(path);

        const command = createBaseBuilder(
            new SlashCommandSubcommandGroupBuilder(),
            name,
            config
        );

        const files = fs.readdirSync(dir).filter((file) => file !== base);

        for (var file of files) {
            file = join(dir, file);
            if (lstatSync(file).isDirectory())
                throw new Error(`Must be a file ${file}`);

            const data = (await import(file)).default as
                | SlashCommandFile
                | undefined;

            if (data instanceof SlashCommandFile) {
                command.addSubcommand(data.buildSubCommand(file));
                console.log("Subcommand Loaded", file);
            }
        }

        return command;
    }
}
