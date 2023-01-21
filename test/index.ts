import { Client, GatewayIntentBits } from "discord.js";
import { start } from "../src";
import { join } from "path";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

start(client, {
    dir: join(__dirname, "commands"),
});

client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});

/*
client.login(
    "OTA3OTU1NzgxOTcyOTE4Mjgz.G3s6Qk.yWjaf63NSNTXs4yn3hgemPLH5bIKEqNt9-X_fA"
);
*/
