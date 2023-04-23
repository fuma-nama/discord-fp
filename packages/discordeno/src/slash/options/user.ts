import { optionFactory } from "./base.js";
import { BaseOptionConfig, createBuilder } from "./base.js";
import { ApplicationCommandOptionTypes, User } from "discordeno";

export type UserOptionConfig = BaseOptionConfig;

export const user = optionFactory<User, UserOptionConfig>((config, name) => {
    return createBuilder(ApplicationCommandOptionTypes.User, name, config);
});
