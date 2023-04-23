import { Node, Group } from "@/utils/reader.js";
import { GroupLoader, LoadContext } from "@/utils/loader.js";
import { ApplicationCommandConfig, DescriptionConfig } from "@/utils/types.js";
import { createSlashBuilder } from "@/utils/builder.js";
import { SlashCommandLoader } from "./slash.js";
import {
    ApplicationCommandOption,
    ApplicationCommandOptionTypes,
} from "discordeno";

export type SlashGroupConfig = ApplicationCommandConfig & DescriptionConfig;

export class SlashCommandGroupLoader implements GroupLoader {
    readonly type = "group";
    readonly config: SlashGroupConfig;

    constructor(config: SlashGroupConfig) {
        this.config = config;
    }

    async load(self: Group, context: LoadContext) {
        const config = this.config;
        const command = createSlashBuilder(self.name, config);

        command.options = self.nodes.flatMap((node) => {
            if (
                node.type === "file" &&
                node.loader instanceof SlashCommandLoader
            ) {
                const loader = node.loader;
                const subcommand = loader.loadSubCommand(node, context, [
                    command.name,
                    null,
                ]);

                debugNode(node, "Subcommand Loaded");
                return subcommand;
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

                debugNode(node, "Subcommand Group Loaded");
                return group;
            }

            return [];
        });

        context.commands.push(command);
    }

    loadSubCommandGroup(
        { name, nodes }: Group,
        context: LoadContext,
        parent: string
    ): ApplicationCommandOption {
        const config = this.config;
        const group: ApplicationCommandOption = {
            type: ApplicationCommandOptionTypes.SubCommandGroup,
            name: config.name ?? name,
            nameLocalizations: config.names,
            description: config.description,
            descriptionLocalizations: config.descriptions,
        };

        group.options = nodes.flatMap((node) => {
            if (
                node.type === "file" &&
                node.loader instanceof SlashCommandLoader
            ) {
                const loader = node.loader;
                const subcommand = loader.loadSubCommand(node, context, [
                    parent,
                    group.name,
                ]);

                debugNode(node, `Subcommand in ${name} had been Loaded`);
                return subcommand;
            }

            return [];
        });

        return group;
    }
}

function debugNode(node: Node, message: string) {
    console.debug(`${node.path} (${node.type})`, message);
}
