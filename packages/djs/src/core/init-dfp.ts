import { start, StartOptions, StartResult } from "@/core/start.js";
import { ListenerModule } from "@/listener/module.js";
import type { Node } from "@discord-fp/core";
import { Client } from "discord.js";
import {
    CommandBuilder,
    CommandParams,
    initCommandBuilder,
} from "./command.js";

export type DfpConfig = {
    client?: Client;
};

export interface Dfp<Params extends CommandParams> {
    command: CommandBuilder<Params>;
    start(options: StartOptions): Promise<StartResult>;
    loaded: Node[];
    client: Client | null;
    listener: ListenerModule;
}

/** @deprecated Always call this function with config. */
export function initDiscordFP(): Dfp<{ _ctx: {} }>;
export function initDiscordFP(config: DfpConfig): Dfp<{ _ctx: {} }>;
export function initDiscordFP(config: DfpConfig = {}) {
    const dfp: Dfp<{ _ctx: {} }> = {
        command: initCommandBuilder(),
        loaded: [],
        listener: new ListenerModule(),
        client: config.client ?? null,
        async start(options) {
            if (this.client == null) {
                throw new Error("The client can't be null");
            }

            const result = await start(
                {
                    client: this.client,
                    listeners: new ListenerModule(),
                    commands: [],
                },
                options
            );

            this.loaded = result.loaded;
            return result;
        },
    };

    return dfp;
}
