import { Attachment, SlashCommandAttachmentOption } from "discord.js";
import { makeOption, Option } from "../options";
import { BaseOptionConfig, createBuilder } from "./base";

export type AttachmentOptionConfig<Required extends boolean> =
    BaseOptionConfig<Required>;

export function attachment<Required extends boolean = true>(
    config: AttachmentOptionConfig<Required>
) {
    return makeOption<Attachment, Required>(config, {
        build(name) {
            return createBuilder(
                new SlashCommandAttachmentOption(),
                name,
                config
            );
        },
        parse(v) {
            return v?.attachment ?? null;
        },
    });
}
