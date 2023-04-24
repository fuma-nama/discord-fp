import "dotenv/config";
import { initDiscordFP } from "@discord-fp/djs";
import { Client, GatewayIntentBits } from "discord.js";

//store your token in environment variable or put it here
const token = process.env["TOKEN"];

export const client = new Client({ intents: [GatewayIntentBits.Guilds] });
export const dfp = initDiscordFP();

export const command = dfp.command;

export const protectedCommand = dfp.command.middleware(({ event, next }) => {
    //check permissions

    return next({
        ctx: {
            message: "hello world",
        },
        event,
    });
});

client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`);

    dfp.start({
        client,
        load: ["./commands"],
        register: {
            guildsOnly: true,
            guilds: ["684766026776576052"],
        },
    });
});

client.login(token);
