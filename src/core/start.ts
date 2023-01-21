import { Client } from "discord.js";
import fs from "fs";
import { join } from "path";
import { CommandFile, loadDir, loadFile } from "./loader";

export type Config = {
    dir: string;
    filterFiles?: (file: string) => boolean;
};

export async function start(client: Client, config: Config) {
    const files = fs
        .readdirSync(config.dir)
        .filter(config.filterFiles ?? (() => true));
    const loaded: CommandFile[] = [];

    for (const file of files) {
        const path = join(config.dir, file);

        if (fs.lstatSync(path).isDirectory()) {
            const data = await loadDir(path, { client });
            if (data == null) continue;

            if (data != null) loaded.push(...data);
        } else {
            const data = await loadFile(path, { client });
            if (data == null) continue;

            loaded.push(data);
        }
    }

    return loaded;
}
