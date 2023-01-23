import {
    ApplicationCommandOptionBase,
    CacheType,
    CommandInteractionOption,
} from "discord.js";
import {
    string,
    role,
    mention,
    boolean,
    number,
    int,
    attachment,
    channel,
    user,
    BaseOptionConfig,
} from "./options/index";

export type InferOptionType<T> = T extends Option<infer P, infer Required>
    ? Required extends true
        ? P
        : P | null
    : unknown;

export abstract class Option<T, Required extends true | false> {
    readonly config: BaseOptionConfig<Required>;

    constructor(config: BaseOptionConfig<Required>) {
        this.config = config;
    }

    abstract build(name: string): ApplicationCommandOptionBase;
    abstract parse(value: CommandInteractionOption | null): T;
}

export type OptionExtend<T> = {
    build: (name: string) => ApplicationCommandOptionBase;
    parse: (value: CommandInteractionOption | null) => T | null;
};

export function makeOption<T, Required extends boolean = true>(
    config: BaseOptionConfig<Required>,
    option: OptionExtend<T>
) {
    return new (class extends Option<T, Required extends true ? true : false> {
        parse(value: CommandInteractionOption<CacheType>) {
            return option.parse(value) as T;
        }

        override build(name: string) {
            return option.build(name);
        }
    })(config as any);
}

export type SlashOptionsConfig = { [key: string]: Option<any, true | false> };

export type SlashOptions<T extends SlashOptionsConfig> = {
    [K in keyof T]: T[K];
};

export const options = {
    create<T extends SlashOptionsConfig>(options: T): SlashOptions<T> {
        return options;
    },
    string,
    role,
    user,
    int,
    number,
    channel,
    attachment,
    boolean,
    mention,
};
