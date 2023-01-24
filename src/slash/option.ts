import {
    ApplicationCommandOptionBase,
    CommandInteractionOption,
} from "discord.js";
import { BaseOptionConfig } from "./options/index";

export type InferOptionType<T> = T extends Option<infer P> ? P : never;

export abstract class Option<T> {
    readonly config: BaseOptionConfig<never>;

    constructor(config: BaseOptionConfig<never>) {
        this.config = config;
    }

    abstract build(name: string): ApplicationCommandOptionBase;
    abstract parse(value: CommandInteractionOption | null): T;

    transform<R>(fn: (v: T) => R): TransformOption<T, R> {
        return new TransformOption(this, fn);
    }
}

export class TransformOption<T, R> extends Option<R> {
    readonly base: Option<T>;
    readonly fn: (v: T) => R;

    constructor(base: Option<T>, fn: (v: T) => R) {
        super(base.config);
        this.base = base;
        this.fn = fn;
    }

    override parse(value: CommandInteractionOption | null): R {
        const parsed = this.base.parse(value);
        return this.fn(parsed);
    }

    override build(name: string): ApplicationCommandOptionBase {
        return this.base.build(name);
    }
}
