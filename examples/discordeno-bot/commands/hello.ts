import { bot, command } from "@/index.js";
import { options } from "@discord-fp/discordeno";
import { InteractionResponseTypes, sendInteractionResponse } from "discordeno";

export default command.slash({
    description: "Say Hello to you",
    options: {
        name: options
            .string({
                description: "Your name",
                autoComplete(e) {
                    sendInteractionResponse(bot, e.id, e.token, {
                        type: InteractionResponseTypes.ApplicationCommandAutocompleteResult,
                        data: {
                            choices: [{ name: "Mom", value: "Dad" }],
                        },
                    });
                },
            })
            .transform((v) => {
                return `Mr.${v}`;
            }),
    },
    execute: async ({ event, options }) => {
        await sendInteractionResponse(bot, event.id, event.token, {
            type: InteractionResponseTypes.ChannelMessageWithSource,
            data: {
                content: `Hello! ${options.name}`,
            },
        });
    },
});
