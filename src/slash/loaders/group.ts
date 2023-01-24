import { Group, Node } from "@/types";
import { SlashCommandSubcommandGroupBuilder } from "discord.js";
import { parse } from "path";
import { GroupLoader, LoadContext } from "../../core";
import { createSlashBuilder, createBaseBuilder } from "../../utils";
import { SlashCommandFile } from "./file";
import { GroupMetaConfig } from "../slash";
import { debugNode } from "@/utils/log";

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
            if (
                node.type === "file" &&
                node.loader instanceof SlashCommandFile
            ) {
                const loader = node.loader;
                const subcommand = loader.loadSubCommand(node, context, [
                    command.name,
                    null,
                ]);

                command.addSubcommand(subcommand);
                debugNode(node, "Subcommand Loaded");
                continue;
            }

            if (
                node.type === "group" &&
                node.meta.loader instanceof SlashCommandGroupFile
            ) {
                const loader = node.meta.loader;
                const group = loader.loadSubCommandGroup(
                    node,
                    context,
                    command.name
                );

                command.addSubcommandGroup(group);
                debugNode(node, "Subcommand Group Loaded");
                continue;
            }

            errorInvalidFile(node);
        }

        context.commands.push(command);
    }

    loadSubCommandGroup(self: Group, context: LoadContext, parent: string) {
        const config = this.config;
        const { name } = parse(self.path);

        const group = createBaseBuilder(
            new SlashCommandSubcommandGroupBuilder(),
            name,
            config
        );

        for (const node of self.nodes) {
            if (
                node.type === "file" &&
                node.loader instanceof SlashCommandFile
            ) {
                const loader = node.loader;
                const subcommand = loader.loadSubCommand(node, context, [
                    parent,
                    group.name,
                ]);

                group.addSubcommand(subcommand);
                debugNode(node, `Subcommand in ${name} had been Loaded`);
                continue;
            }

            errorInvalidFile(node);
        }

        return group;
    }
}

function errorInvalidFile(node: Node) {
    throw new Error(`Invalid file ${node.path} (${node.type})`);
}
