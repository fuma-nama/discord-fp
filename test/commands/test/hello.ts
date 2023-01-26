import { options, slash } from "../../../src/index.js";

/**
 * Typesafe discord.js command framework
 */
export default slash({
    description: "Say Hello to you",
    options: {
        name: options
            .string({
                description: "Your name",
                autoComplete(e) {
                    const items = ["hello", "world"];
                    const v = e.options.getFocused();

                    const result = items.filter((item) => item.startsWith(v));
                    e.respond(
                        result.map((item) => ({ name: item, value: item }))
                    );
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
                return v?.username ?? null;
            }),
    },
    execute: async ({ event, options }) => {
        await event.reply(`Hello, ${options.name} ${options.user}`);
    },
});
