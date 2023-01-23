import {
    APIInteractionDataResolvedChannel,
    ApplicationCommandOptionAllowedChannelTypes,
    GuildBasedChannel,
    SlashCommandChannelOption,
} from "discord.js";
import { makeOption } from "../options";
import { BaseOptionConfig, createBuilder } from "./base";

export type ChannelOptionConfig<Required extends boolean> =
    BaseOptionConfig<Required> & {
        types?: ApplicationCommandOptionAllowedChannelTypes[];
    };

export function channel<Required extends boolean = true>(
    config: ChannelOptionConfig<Required>
) {
    return makeOption<
        APIInteractionDataResolvedChannel | GuildBasedChannel,
        Required
    >(config, {
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
