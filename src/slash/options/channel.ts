import {
    APIInteractionDataResolvedChannel,
    ApplicationCommandOptionAllowedChannelTypes,
    GuildBasedChannel,
    SlashCommandChannelOption,
} from "discord.js";
import { makeOption, MakeOption } from "../option.js";
import { BaseOptionConfig, createBuilder } from "./base.js";

export type ChannelOptionConfig<Required extends boolean> =
    BaseOptionConfig<Required> & {
        types?: ApplicationCommandOptionAllowedChannelTypes[];
    };

export function channel<Required extends boolean = true>(
    config: ChannelOptionConfig<Required>
): MakeOption<APIInteractionDataResolvedChannel | GuildBasedChannel, Required> {
    return makeOption(config, {
        build(name) {
            const builder = createBuilder(
                new SlashCommandChannelOption(),
                name,
                config
            );

            if (config.types != null) {
                builder.addChannelTypes(...config.types);
            }

            return builder;
        },
        parse(value) {
            return value?.channel ?? null;
        },
    });
}
