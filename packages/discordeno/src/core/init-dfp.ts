import { start, StartOptions, StartResult } from "@/core/start.js";
import { ListenerModule } from "@/listener/module.js";
import type { Node } from "@/shared/reader.js";
import {
    CommandBuilder,
    CommandParams,
    initCommandBuilder,
} from "./command.js";

export interface Dfp<Params extends CommandParams> {
    command: CommandBuilder<Params>;
    start(options: StartOptions): Promise<StartResult>;
    loaded: Node[];
    listener: ListenerModule;
}

export function initDiscordFP() {
    const dfp: Dfp<{ _ctx: {} }> = {
        command: initCommandBuilder(),
        loaded: [],
        listener: new ListenerModule(),
        async start(options) {
            const result = await start(options);

            this.loaded = result.loaded;
            return result;
        },
    };

    return dfp;
}
