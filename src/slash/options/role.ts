import { APIRole, Role, SlashCommandRoleOption } from "discord.js";
import { makeOption } from "../options";
import { BaseOptionConfig, createBuilder } from "./base";

export type RoleOptionConfig<Required extends boolean> =
    BaseOptionConfig<Required>;

export function role<Required extends boolean = true>(
    config: RoleOptionConfig<Required>
) {
    return makeOption<Role | APIRole, Required>(config, {
        parse(value) {
            return value?.role ?? null;
        },

        build(name) {
            return createBuilder(new SlashCommandRoleOption(), name, config);
        },
    });
}
