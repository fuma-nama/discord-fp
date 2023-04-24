import { ListenerModule } from "@/listener/module.js";
import { ApplicationCommandDataResolvable, Client } from "discord.js";
import { FileLoader, GroupLoader } from "@discord-fp/core";

export type LoadContext = {
    client: Client;
    commands: ApplicationCommandDataResolvable[];
    listeners: ListenerModule;
};

export type FPGroupLoader = GroupLoader<LoadContext>;
export type FPFileLoader = FileLoader<LoadContext>;
