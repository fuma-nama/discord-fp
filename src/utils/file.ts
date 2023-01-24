import { FileExport } from "./../types";
import { lstatSync, readdirSync } from "fs";
import { join, parse } from "path";
import { FileLoader, GroupLoader } from "../core";
import { File, Folder, Group, Meta, MetaExport, Node } from "../types";

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
        if (meta == null && parse(file).name === "_meta") {
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
    const { default: loader } = (await import(path)) as FileExport;

    if (!(loader instanceof FileLoader))
        throw new Error(`Invalid loader ${path}`);

    return {
        name: parse(path).name,
        type: "file",
        path,
        loader: loader,
    };
}

export async function readMeta(path: string): Promise<Meta> {
    const { default: loader, middleware } = (await import(path)) as MetaExport;

    if (middleware != null && typeof middleware !== "function")
        throw new Error(`Invalid middleware ${path}`);

    if (loader != null && !(loader instanceof GroupLoader))
        throw new Error(`Invalid loader ${path}`);

    return {
        loader,
        middleware,
    };
}

export async function readDir(dir: string): Promise<Folder | Group> {
    const [meta, files] = findMetaFile(readdirSync(dir));

    const nodes: Node[] = [];
    for (const file of files) {
        nodes.push(await readNode(join(dir, file)));
    }

    if (meta == null) {
        return {
            type: "folder",
            path: dir,
            nodes: nodes,
        };
    } else {
        return {
            name: parse(dir).name,
            type: "group",
            path: dir,
            meta: await readMeta(join(dir, meta)),
            nodes: nodes,
        };
    }
}
