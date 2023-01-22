import { lstatSync, readdirSync } from "fs";
import { join, parse } from "path";
import { FileLoader, GroupLoader } from "../core";
import { File, Folder, Group, Meta, Node } from "../types";

/**
 *
 * @param dir The path of dir
 * @param files files to search
 */
export function findMetaFile(
    files: string[]
): [meta: string | null, nodes: string[]] {
    var meta: string | null = null;
    const nodes: string[] = [];

    for (const file of files) {
        if (parse(file).name === "_meta") {
            meta = file;
        } else {
            nodes.push(file);
        }
    }

    return [meta, nodes];
}

export async function readNode(path: string): Promise<Node> {
    if (lstatSync(path).isDirectory()) {
        return await readDir(path);
    } else {
        return await readFile(path);
    }
}

export async function readFile(path: string): Promise<File> {
    const loader = (await import(path)).default as FileLoader | undefined;

    if (loader == null) throw new Error(`Failed to find loader ${path}`);
    return {
        type: "file",
        path,
        loader: loader,
    };
}

export async function readMeta(path: string): Promise<Meta> {
    const loader = (await import(path)).default as GroupLoader | undefined;

    if (loader == null) throw new Error(`Failed to find loader ${path}`);
    return {
        loader: loader,
    };
}

export async function readDir(dir: string): Promise<Folder | Group> {
    const [meta, files] = findMetaFile(readdirSync(dir));

    const nodes = await Promise.all(
        files.flatMap(async (file) => {
            return await readNode(join(dir, file));
        })
    );

    if (meta == null) {
        return {
            type: "folder",
            path: dir,
            nodes: nodes,
        };
    } else {
        return {
            type: "group",
            path: dir,
            meta: await readMeta(join(dir, meta)),
            nodes: nodes,
        };
    }
}
