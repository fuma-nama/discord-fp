import { ApplicationCommandConfig, DescriptionConfig } from "@/utils/types.js";
import {
    ApplicationCommandTypes,
    CreateContextApplicationCommand,
    CreateSlashApplicationCommand,
} from "discordeno";

export function createSlashBuilder(
    name: string,
    config: ApplicationCommandConfig & DescriptionConfig
): CreateSlashApplicationCommand {
    return {
        type: ApplicationCommandTypes.ChatInput,
        name: config.name ?? name,
        nameLocalizations: config.names,
        description: config.description,
        descriptionLocalizations: config.descriptions,
        dmPermission: config.scope?.dm,
        defaultMemberPermissions: config.scope?.member,
        options: [],
    };
}

export function createContextBuilder(
    name: string,
    config: ApplicationCommandConfig,
    type: ApplicationCommandTypes.Message | ApplicationCommandTypes.User
): CreateContextApplicationCommand {
    return {
        type,
        name: config.name ?? name,
        nameLocalizations: config.names,
        dmPermission: config.scope?.dm,
        defaultMemberPermissions: config.scope?.member,
    };
}
