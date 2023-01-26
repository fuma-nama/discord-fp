import { APIRole, Role, SlashCommandRoleOption } from "discord.js";
import { makeOption, MakeOption } from "../option.js";
import { BaseOptionConfig, createBuilder } from "./base.js";

export type RoleOptionConfig<Required extends boolean> =
    BaseOptionConfig<Required>;

export function role<Required extends boolean = true>(
    config: RoleOptionConfig<Required>
): MakeOption<Role | APIRole, Required> {
    return makeOption(config, {
        parse(value) {
            return value?.role ?? null;
        },

        build(name) {
            return createBuilder(new SlashCommandRoleOption(), name, config);
        },
    });
}
