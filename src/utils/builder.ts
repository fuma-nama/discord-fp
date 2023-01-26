import { ApplicationCommandConfig, DescriptionConfig } from "@/types.js";
import {
    ContextMenuCommandBuilder,
    SharedNameAndDescription,
    SlashCommandBuilder,
} from "discord.js";

export function createSlashBuilder(
    name: string,
    config: ApplicationCommandConfig & DescriptionConfig
) {
    const builder = createBaseBuilder(new SlashCommandBuilder(), name, config);
    builder.setDMPermission(config.scope?.dm);
    builder.setDefaultMemberPermissions(config.scope?.member);

    return builder;
}

export function createBaseBuilder<B extends SharedNameAndDescription>(
    builder: B,
    name: string,
    config: ApplicationCommandConfig & DescriptionConfig
): B {
    builder = builder
        .setName(config.name ?? name)
        .setNameLocalizations(config.names ?? {})
        .setDescriptionLocalizations(config.names ?? {})
        .setDescription(config.description);

    return builder;
}

export function createContextBuilder(
    name: string,
    config: ApplicationCommandConfig
) {
    return new ContextMenuCommandBuilder()
        .setName(config.name ?? name)
        .setNameLocalizations(config.names ?? {})
        .setDMPermission(config.scope?.dm)
        .setDefaultMemberPermissions(config.scope?.member);
}
