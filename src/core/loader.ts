import { lstatSync, readdirSync } from "fs";
import { Client } from "discord.js";
import { join } from "path";
import { findMetaFile } from "../utils";

export abstract class CommandFile {
    /**
     * @param path Path of the file to be loaded
     * @param context
     */
    abstract load(path: string, context: LoadContext): void | Promise<void>;
}

export abstract class MetaFile extends CommandFile {}

export type LoadContext = {
    client: Client;
};

export async function loadFile(
    path: string,
    context: LoadContext
): Promise<CommandFile | undefined> {
    const data = (await import(path)).default as CommandFile | undefined;

    if (data == null) {
        console.warn("Skipped a file without the default export", path);
        return;
    }

    try {
        await data.load(path, context);
    } catch (e) {
        throw new Error(`Failed to load ${path}`, { cause: e });
    }

    console.log("File Loaded", path);
    return data;
}

export async function loadDir(
    dir: string,
    context: LoadContext
): Promise<CommandFile[] | undefined> {
    const files = readdirSync(dir);
    const meta = findMetaFile(dir, files);

    const loaded: CommandFile[] = [];

    if (meta == null) {
        for (const file of files) {
            const data = await loadFileOrDir(join(dir, file), context);
            if (data == null) return [];

            loaded.push(...data);
        }
    } else {
        const data = await loadFile(meta, context);

        if (data == null) return [];

        loaded.push(data);
    }

    return loaded;
}

async function loadFileOrDir(path: string, context: LoadContext) {
    if (lstatSync(path).isDirectory()) {
        const data = await loadDir(path, context);
        if (data == null) return;

        return data;
    } else {
        const data = await loadFile(path, context);
        if (data == null) return;

        return [data];
    }
}
