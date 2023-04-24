import { ListenerModule } from "@/listener/module.js";
import { ApplicationCommandDataResolvable } from "discord.js";
import { FileLoader, GroupLoader } from "@discord-fp/core";

export type LoadContext = {
    commands: ApplicationCommandDataResolvable[];
    listeners: ListenerModule;
};

export type FPGroupLoader = GroupLoader<LoadContext>;
export type FPFileLoader = FileLoader<LoadContext>;
