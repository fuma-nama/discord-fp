import { ApplicationCommandOptionTypes, Role } from "discordeno";
import { BaseOptionConfig, createBuilder, optionFactory } from "./base.js";

export type RoleOptionConfig = BaseOptionConfig;

export const role = optionFactory<Role, RoleOptionConfig>((config, name) => {
    return createBuilder(ApplicationCommandOptionTypes.Role, name, config);
});
