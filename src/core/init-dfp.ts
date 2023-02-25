import { start, StartOptions, StartResult } from "@/core/start.js";
import type { Node } from "@/shared/reader.js";
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
}

export function initDiscordFP(config: DfpConfig) {
    const dfp: Dfp<{ _ctx: {} }> = {
        command: initCommandBuilder(),
        loaded: [],
        client: config.client ?? null,
        async start(options) {
            if (this.client == null) {
                throw new Error("The client can't be null");
            }

            const result = await start(this.client, options);

            this.loaded = result.loaded;
            return result;
        },
    };

    return dfp;
}
