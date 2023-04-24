import { ApplicationCommandOptionTypes, Interaction } from "discordeno";
import { UserOptionValue, MentionableOptionValue } from "./index.js";

type RawOption = {
    name: string;
    value?: any;
    type: ApplicationCommandOptionTypes;
};

export function getRawOptions(e: Interaction): RawOption[] {
    const first = e.data?.options?.[0];

    if (first == null) {
        return [];
    }
    if (first.type === ApplicationCommandOptionTypes.SubCommandGroup) {
        return first.options?.[0].options ?? [];
    }
    if (first.type === ApplicationCommandOptionTypes.SubCommand) {
        return first.options ?? [];
    }

    return e.data?.options ?? [];
}

export function parseOptionValue(
    data: RawOption,
    interation: Interaction
): any {
    const resolved = interation.data?.resolved;

    if (resolved == null) {
        return data.value;
    }

    if (data.type === ApplicationCommandOptionTypes.User) {
        const id = BigInt(data.value);

        return {
            value: resolved.users?.get(id),
            member: resolved.members?.get(id),
        } as UserOptionValue;
    }

    if (data.type === ApplicationCommandOptionTypes.Attachment) {
        return resolved.attachments?.get(BigInt(data.value));
    }

    if (data.type === ApplicationCommandOptionTypes.Channel) {
        return resolved.channels?.get(BigInt(data.value));
    }

    if (data.type === ApplicationCommandOptionTypes.Role) {
        return resolved.roles?.get(BigInt(data.value));
    }

    if (data.type === ApplicationCommandOptionTypes.Mentionable) {
        const id = BigInt(data.value);
        const role = resolved.roles?.get(id);

        if (role != null) {
            return {
                type: "role",
                value: role,
            } as MentionableOptionValue;
        } else {
            const user = resolved.users?.get(id);
            const member = resolved.members?.get(id);

            return {
                type: "user",
                user,
                member,
            } as MentionableOptionValue;
        }
    }

    return data.value;
}
