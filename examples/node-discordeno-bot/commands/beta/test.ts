import { options } from "@discord-fp/discordeno";
import { command } from "@/index.js";

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
    execute({ options }) {
        if (options.mention?.type === "role") {
            console.log("role", options.mention.value.name);
        }

        console.log(options);
    },
});
