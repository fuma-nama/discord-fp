import "dotenv/config";
import { initDiscordFP } from "@discord-fp/discordeno";
import { createBot, startBot } from "discordeno";

//store your token in environment variable or put it here
const token = process.env["TOKEN"]!;
const dfp = initDiscordFP();

export const bot = createBot({
    token,
});

export const command = dfp.command;

dfp.start({
    bot,
    load: ["./commands"],
});

startBot(bot);
