import { Group } from "@types";
import { SlashCommandSubcommandGroupBuilder } from "discord.js";
import { parse } from "path";
import { GroupLoader, LoadContext } from "../../core";
import { createSlashBuilder, createBaseBuilder } from "../../utils";
import { SlashCommandFile } from "./file";
import { GroupMetaConfig } from "../slash";
import { logNode } from "@/utils/log";

export class SlashCommandGroupFile extends GroupLoader {
    readonly config: GroupMetaConfig;

    constructor(config: GroupMetaConfig) {
        super();
        this.config = config;
    }

    override async load(self: Group, context: LoadContext) {
        const config = this.config;
        const { name } = parse(self.path);
        const command = createSlashBuilder(name, config);

        for (const node of self.nodes) {
            if (node.type === "file") {
                const loader = node.loader as SlashCommandFile;

                command.addSubcommand(loader.buildSubCommand(node));
                logNode(node, "Subcommand Loaded");

                continue;
            }

            if (node.type === "group") {
                const loader = node.meta.loader as SlashCommandGroupFile;

                command.addSubcommandGroup(
                    await loader.buildSubCommandGroup(node)
                );
                logNode(node, "Subcommand Group Loaded");
                continue;
            }

            throw new Error(`Invalid file ${node}`);
        }

        context.commands.push(command);
    }

    async buildSubCommandGroup(self: Group) {
        const config = this.config;
        const { name } = parse(self.path);

        const command = createBaseBuilder(
            new SlashCommandSubcommandGroupBuilder(),
            name,
            config
        );

        for (const node of self.nodes) {
            if (node.type !== "file")
                throw new Error(`Must be a file ${node.path}`);

            if (node.loader instanceof SlashCommandFile) {
                command.addSubcommand(node.loader.buildSubCommand(node));

                logNode(node, `Subcommand in ${name} had been Loaded`);
            }
        }

        return command;
    }
}
