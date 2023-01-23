import { APIUser, SlashCommandUserOption, User } from "discord.js";
import { makeOption } from "../options";
import { BaseOptionConfig, createBuilder } from "./base";

export type UserOptionConfig<Required extends boolean> =
    BaseOptionConfig<Required>;

export function user<Required extends boolean = true>(
    config: UserOptionConfig<Required>
) {
    return makeOption<User | APIUser, Required>(config, {
        build(name: string) {
            return createBuilder(new SlashCommandUserOption(), name, config);
        },

        parse(value) {
            return value?.user ?? null;
        },
    });
}
