import {
    ApplicationCommandOptionTypes,
    Channel,
    Member,
    Role,
    User,
} from "discordeno";
import { BaseOptionConfig, createBuilder, optionFactory } from "./base.js";

export type MentionOptionConfig = BaseOptionConfig;

export const mention = optionFactory<
    User | Role | Member | Channel,
    MentionOptionConfig
>((config, name) => {
    return createBuilder(
        ApplicationCommandOptionTypes.Mentionable,
        name,
        config
    );
});
