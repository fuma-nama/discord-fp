import { start, StartOptions, StartResult } from "@/core/start.js";
import type { Node } from "@/shared/reader.js";
import { Client } from "discord.js";
import {
    CommandBuilder,
    CommandParams,
    initCommandBuilder,
} from "./command.js";

export type DfpConfig = {
    client: Client;
};

export interface Dfp<Params extends CommandParams> {
    command: CommandBuilder<Params>;
    start(options: StartOptions): Promise<StartResult>;
    loaded: Node[];
}

export function initDiscordFP(config: DfpConfig) {
    const dfp: Dfp<{ _ctx: {} }> = {
        command: initCommandBuilder(),
        loaded: [],
        async start(options) {
            const result = await start(config.client, options);

            this.loaded = result.loaded;
            return result;
        },
    };

    return dfp;
}
