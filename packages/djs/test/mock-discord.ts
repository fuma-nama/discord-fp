import { Client, User } from "discord.js";

const client = new Client({ intents: [] });

export const user = new (User as any)(client, {
    id: "user-id",
    username: "user username",
    discriminator: "user#0000",
    avatar: "user avatar url",
    bot: false,
});
