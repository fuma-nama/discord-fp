import {
    APIInteractionDataResolvedGuildMember,
    GuildMember,
    SlashCommandUserOption,
    User,
} from "discord.js";
import { makeOption, MakeOption } from "./base.js";
import { BaseOptionConfig, createBuilder } from "./base.js";

export type UserOptionConfig<Required extends boolean> =
    BaseOptionConfig<Required>;

export type ParsedUserValue = {
    user: User;
    member?: GuildMember | APIInteractionDataResolvedGuildMember;
};

export function user<Required extends boolean = true>(
    config: UserOptionConfig<Required>
): MakeOption<ParsedUserValue, Required> {
    return makeOption(config, {
        build: (name) => {
            return createBuilder(new SlashCommandUserOption(), name, config);
        },

        parse(value) {
            if (value == null || value.user == null) return null;

            return {
                user: value.user,
                member: value.member ?? undefined,
            };
        },
    });
}
