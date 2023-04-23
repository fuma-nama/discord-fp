import { ApplicationCommandOptionTypes, Attachment } from "discordeno";
import { optionFactory } from "./base.js";
import { BaseOptionConfig, createBuilder } from "./base.js";

export type AttachmentOptionConfig = BaseOptionConfig;

export const attachment = optionFactory<Attachment, AttachmentOptionConfig>(
    (config, name) => {
        return createBuilder(
            ApplicationCommandOptionTypes.Attachment,
            name,
            config
        );
    }
);
