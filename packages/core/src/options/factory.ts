type SlashCommandKey = [
    name: string,
    subcommandGroup: string | null,
    subcommand: string | null
];

type Global = {
    output: unknown;
    context: unknown;
};

type Option<T, Types extends Global = Global> = {
    build(
        name: string,
        command: SlashCommandKey,
        context: Types["context"]
    ): Types["output"];
    parse(value: unknown): T;
    transform<R extends any>(fn: (v: T) => R): Option<R, Types>;
};

type OptionFactory<Config, T, Types extends Global> = {
    <Required extends boolean = true>(
        config: Omit<Config, "required"> & { required?: Required }
    ): Option<Required extends true ? T : T | null, Types>;
};

export function optionFactory<T, Config, Types extends Global>(
    build: (
        config: Config,
        name: string,
        command: SlashCommandKey,
        context: Types["context"]
    ) => Types["output"]
): OptionFactory<Config, T, Types> {
    return (config) => ({
        build: (...args) => build(config as Config, ...args),
        parse(value) {
            return value as T;
        },
        transform(fn) {
            const parse = this.parse;

            return {
                ...(this as Option<any, Types>),
                parse(value) {
                    return fn(parse(value));
                },
            };
        },
    });
}

export type InferOption<T, Types extends Global> = Option<T, Types>;
export type InferOptionType<T> = T extends Option<infer P, Global> ? P : never;
