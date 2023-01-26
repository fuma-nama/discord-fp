import { APIUser, SlashCommandUserOption, User } from "discord.js";
import { makeOption, MakeOption } from "../option.js";
import { BaseOptionConfig, createBuilder } from "./base.js";

export type UserOptionConfig<Required extends boolean> =
    BaseOptionConfig<Required>;

export function user<Required extends boolean = true>(
    config: UserOptionConfig<Required>
): MakeOption<User | APIUser, Required> {
    return makeOption(config, {
        build: (name) => {
            return createBuilder(new SlashCommandUserOption(), name, config);
        },

        parse(value) {
            return value?.user ?? null;
        },
    });
}
