import { bot, command } from "@/index.js";
import { InteractionResponseTypes, sendInteractionResponse } from "discordeno";

export default command.slash({
    description: "Ping Command",
    execute: async ({ event }) => {
        await sendInteractionResponse(bot, event.id, event.token, {
            type: InteractionResponseTypes.ChannelMessageWithSource,
            data: {
                content: `Hello! ${event.user.username}`,
            },
        });
    },
});
