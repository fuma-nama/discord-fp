import { initDiscordFP } from "discordfp";
import { createBot } from "https://deno.land/x/discordeno@18.0.1/mod.ts";
import { load } from "https://deno.land/std@0.184.0/dotenv/mod.ts";
import { startBot } from "https://deno.land/x/discordeno@18.0.1/bot.ts";
const vars = await load();

const bot = createBot({
    token: vars["TOKEN"],
});

export const dfp = initDiscordFP();
export const command = dfp.command;

dfp.start({
    bot: bot,
    load: ["./commands"],
});

await startBot(bot);
