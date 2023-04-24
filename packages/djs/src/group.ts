import { ApplicationCommandConfig, DescriptionConfig } from "@/utils/types.js";
import { SlashCommandSubcommandGroupBuilder } from "discord.js";
import { FPGroupLoader, LoadContext } from "@/utils/loader.js";
import { createSlashBuilder, createBaseBuilder } from "@/utils/builder.js";
import { SlashCommandLoader } from "./slash.js";
import { Node, Group } from "@discord-fp/core";

export type SlashGroupConfig = ApplicationCommandConfig & DescriptionConfig;

export class SlashCommandGroupLoader implements FPGroupLoader {
    readonly config: SlashGroupConfig;

    constructor(config: SlashGroupConfig) {
        this.config = config;
    }

    async load(self: Group, context: LoadContext) {
        const config = this.config;
        const command = createSlashBuilder(self.name, config);

        for (const node of self.nodes) {
            if (
                node.type === "file" &&
                node.loader instanceof SlashCommandLoader
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
                node.meta.loader instanceof SlashCommandGroupLoader
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

    loadSubCommandGroup(
        { name, nodes }: Group,
        context: LoadContext,
        parent: string
    ) {
        const config = this.config;

        const group = createBaseBuilder(
            new SlashCommandSubcommandGroupBuilder(),
            name,
            config
        );

        for (const node of nodes) {
            if (
                node.type === "file" &&
                node.loader instanceof SlashCommandLoader
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

function debugNode(node: Node, message: string) {
    console.debug(`${node.path} (${node.type})`, message);
}
