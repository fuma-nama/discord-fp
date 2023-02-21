import {
    APIInteractionDataResolvedGuildMember,
    APIRole,
    APIUser,
    GuildMember,
    Role,
    SlashCommandMentionableOption,
    User,
} from "discord.js";
import { MakeOption, makeOption } from "./base.js";
import { BaseOptionConfig, createBuilder } from "./base.js";

export type ParsedMentionValue =
    | {
          type: "user";
          value: User | APIUser;
      }
    | {
          type: "role";
          value: Role | APIRole;
      }
    | {
          type: "member";
          value: GuildMember | APIInteractionDataResolvedGuildMember;
      };

export type MentionOptionConfig<Required extends boolean> =
    BaseOptionConfig<Required>;

export function mention<Required extends boolean = true>(
    config: MentionOptionConfig<Required>
): MakeOption<ParsedMentionValue, Required> {
    return makeOption(config, {
        build(name) {
            return createBuilder(
                new SlashCommandMentionableOption(),
                name,
                config
            );
        },
        parse(value) {
            if (value == null) return null;

            if (value.member != null)
                return {
                    type: "member",
                    value: value.member,
                };

            if (value.user != null)
                return {
                    type: "user",
                    value: value.user,
                };
            if (value.role != null)
                return {
                    type: "role",
                    value: value.role,
                };

            return null;
        },
    });
}
