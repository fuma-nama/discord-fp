import { optionFactory } from "./base.js";
import { BaseOptionConfig, createBuilder } from "./base.js";
import {
    ApplicationCommandOptionTypes,
    Channel,
    ChannelTypes,
} from "discordeno";

export type ChannelOptionConfig = BaseOptionConfig & {
    types?: ChannelTypes[];
};

export const channel = optionFactory<Channel, ChannelOptionConfig>(
    (config, name) => {
        const builder = createBuilder(
            ApplicationCommandOptionTypes.Channel,
            name,
            config
        );

        if (config.types != null) {
            builder.channelTypes = config.types;
        }

        return builder;
    }
);
