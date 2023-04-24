import {
    APIInteractionDataResolvedGuildMember,
    APIRole,
    APIUser,
    ApplicationCommandOptionType,
    CommandInteractionOption,
    GuildMember,
    Role,
    User,
} from "discord.js";

export type ParsedUserValue = {
    value: User;
    member?: GuildMember | APIInteractionDataResolvedGuildMember;
};
export type ParsedMentionValue =
    | {
          type: "user";
          user: User | APIUser;
          member?: GuildMember | APIInteractionDataResolvedGuildMember;
      }
    | {
          type: "role";
          value: Role | APIRole;
      };

export function parseOptionValue(
    option: CommandInteractionOption
): unknown | null {
    switch (option.type) {
        case ApplicationCommandOptionType.Attachment:
            return option.attachment ?? null;
        case ApplicationCommandOptionType.String:
        case ApplicationCommandOptionType.Number:
        case ApplicationCommandOptionType.Integer:
        case ApplicationCommandOptionType.Boolean:
            return option.value ?? null;
        case ApplicationCommandOptionType.Channel:
            return option.channel ?? null;
        case ApplicationCommandOptionType.Role:
            return option.role ?? null;
        case ApplicationCommandOptionType.User:
            return {
                value: option.user,
                member: option.member ?? undefined,
            } as ParsedUserValue;
        case ApplicationCommandOptionType.Mentionable:
            if (option.role != null) {
                return {
                    type: "role",
                    value: option.role,
                } as ParsedMentionValue;
            }

            return {
                type: "user",
                user: option.user,
                member: option.member ?? undefined,
            } as ParsedMentionValue;
        default:
            return null;
    }
}
