import { BaseOptionConfig, createBuilder, optionFactory } from "./base.js";
import { ApplicationCommandOptionTypes } from "discordeno";

export type BooleanOptionConfig = BaseOptionConfig;

export const boolean = optionFactory<boolean, BooleanOptionConfig>(
    (config, name) => {
        return createBuilder(
            ApplicationCommandOptionTypes.Boolean,
            name,
            config
        );
    }
);
