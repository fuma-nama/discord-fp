import { message } from "discord-fp";

export default message({
    name: "Delete Message",
    async execute(e) {
        await e.reply("I don't wanna delete message!");
    },
});
