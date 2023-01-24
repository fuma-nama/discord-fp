import {
    ApplicationCommandOptionBase,
    CacheType,
    CommandInteractionOption,
} from "discord.js";
import { Option } from "./option";
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

export type OptionExtend<T> = {
    build: (name: string) => ApplicationCommandOptionBase;
    parse: (value: CommandInteractionOption | null) => T | null;
};

export function makeOption<T, Required extends boolean = true>(
    config: BaseOptionConfig<Required>,
    option: OptionExtend<T>
) {
    return new (class extends Option<Required extends true ? T : T | null> {
        parse(
            value: CommandInteractionOption<CacheType>
        ): Required extends true ? T : T | null {
            return option.parse(value) as any;
        }

        override build(name: string) {
            return option.build(name);
        }
    })(config as any);
}

export const options = {
    custom: makeOption,
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
