export type SlashCommandKey = [
    command: string,
    subcommandGroup: string | null,
    subcommand: string | null
];
export type MenuCommandKey = [name: string];
export type AutoCompleteKey = [key: SlashCommandKey, name: string];
