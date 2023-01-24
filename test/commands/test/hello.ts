import { options, slash } from "discord-fp";

/**
 * Typesafe discord.js command framework
 */
export default slash({
    description: "Say Hello to you",
    options: {
        name: options
            .string({
                description: "Your name",
                choices: {
                    hello: { value: "Hello World" },
                },
            })
            .transform((v) => {
                return `Hello ${v}`;
            }),
        enabled: options.boolean({
            required: true,
            description: "Enabled",
            descriptions: {
                "en-GB": "Hello",
            },
        }),
        number: options.number({
            description: "Example number",
            required: true,
        }),
        user: options
            .user({
                description: "Ping user",
                required: false,
            })
            .transform((v) => {
                return v?.username;
            }),
    },
    execute: async ({ event, options }) => {
        await event.reply(`Hello, ${options.name} ${options.user}`);
    },
});
