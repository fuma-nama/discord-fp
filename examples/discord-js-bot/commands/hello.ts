import { command } from "@/index.js";
import { options } from "@discord-fp/djs";

export default command.slash({
    description: "Say Hello to you",
    options: {
        name: options
            .string({
                description: "Your name",
            })
            .transform((v) => {
                return `Mr.${v}`;
            }),
        user: options.user({
            description: "User",
        }),
    },
    execute: async ({ event, options }) => {
        console.log(options.user);
        await event.reply(`Hello! ${options.name}`);
    },
});
