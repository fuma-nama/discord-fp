import { options } from "@discord-fp/discordeno";
import { bot, command } from "@/index.js";
import { InteractionResponseTypes, sendInteractionResponse } from "discordeno";

export default command.slash({
    description: "Test Command",
    options: {
        text: options.string({
            description: "Text",
            maxLen: 10,
        }),
        user: options.user({
            description: "User",
        }),
        channel: options.channel({
            description: "Channel",
        }),
        mention: options.mention({
            description: "Mention",
            required: false,
        }),
    },
    execute({ event, options }) {
        if (options.mention?.type === "role") {
            console.log("role", options.mention.value.name);
        }

        console.log(options);

        sendInteractionResponse(bot, event.id, event.token, {
            type: InteractionResponseTypes.ChannelMessageWithSource,
            data: {
                content: "Hello World",
            },
        });
    },
});
