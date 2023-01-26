import { LoadContext } from "@/core/loader.js";
import { SlashCommandKey } from "@/listener/slash.js";
import {
    ApplicationCommandOptionBase,
    CommandInteractionOption,
} from "discord.js";
import { BaseOptionConfig } from "./options/base.js";

export type InferOptionType<T> = T extends Option<infer P> ? P : never;

export type Option<T> = {
    readonly config: BaseOptionConfig<boolean>;
    build(
        name: string,
        command: SlashCommandKey,
        context: LoadContext
    ): ApplicationCommandOptionBase;
    parse(value: CommandInteractionOption | null): T;
    transform<R>(fn: (v: T) => R): Option<R>;
};

export type OptionExtend<T> = {
    build: (
        name: string,
        command: SlashCommandKey,
        context: LoadContext
    ) => ApplicationCommandOptionBase;
    parse: (value: CommandInteractionOption | null) => T | null;
};

export type MakeOption<T, Required extends boolean> = Option<
    Required extends true ? T : T | null
>;

export function makeOption<T, Required extends boolean = true>(
    config: BaseOptionConfig<Required>,
    option: OptionExtend<Required extends true ? T : T | null>
): Option<Required extends true ? T : T | null> {
    return {
        config: config,
        ...option,
        parse(value) {
            return option.parse(value) as T;
        },
        transform<R>(fn: (v: T) => R) {
            return {
                ...(this as Option<R>),
                parse(value) {
                    const parsed = option.parse(value) as T;
                    return fn(parsed);
                },
            };
        },
    };
}
