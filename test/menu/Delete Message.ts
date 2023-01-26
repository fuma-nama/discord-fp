import { message } from "../../src/index.js";

export default message({
    async execute(e) {
        await e.reply("I don't wanna delete message!");
    },
});
