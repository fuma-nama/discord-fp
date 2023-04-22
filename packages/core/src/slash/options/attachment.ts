import { Attachment, SlashCommandAttachmentOption } from "discord.js";
import { makeOption, MakeOption } from "./base.js";
import { BaseOptionConfig, createBuilder } from "./base.js";

export type AttachmentOptionConfig<Required extends boolean> =
    BaseOptionConfig<Required>;

export function attachment<Required extends boolean = true>(
    config: AttachmentOptionConfig<Required>
): MakeOption<Attachment, Required> {
    return makeOption(config, {
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
