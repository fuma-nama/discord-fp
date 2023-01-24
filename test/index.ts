import { Client, GatewayIntentBits } from "discord.js";
import { start } from "discord-fp";
import { join } from "path";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`);

    start(client, {
        dir: join(__dirname, "commands"),
        register: {
            enabled: false,
        },
    });
});

client.login(process.env["TOKEN"] as string);
