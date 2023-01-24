import { message, Middleware } from "discord-fp";

export default message({
    async execute(e) {
        await e.reply("I don't wanna delete message!");
    },
});

export const middleware: Middleware = (e, handler) => {};
