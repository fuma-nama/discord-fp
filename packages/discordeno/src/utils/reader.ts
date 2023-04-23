import { lstatSync, readdirSync } from "fs";
import { join, parse } from "path";
import { pathToFileURL } from "url";
import { FileLoader, GroupLoader } from "./loader.js";

/**
 * base unit
 */
export type Node = File | Group | Folder;

/**
 * A file
 */
export type File = {
    name: string;
    type: "file";
    path: string;
    loader: FileLoader;
};

/**
 * The _meta file used for loading a group
 *
 * Notice that it's not a type of node
 */
export type Meta = {
    loader?: GroupLoader;
};

/**
 * A dir with _meta file
 */
export type Group = {
    name: string;
    type: "group";
    path: string;
    meta: Meta;
    nodes: Node[];
};
/**
 * A folder which contains nodes inside
 */
export type Folder = {
    type: "folder";
    path: string;
    nodes: Node[];
};

export type FileExport = {
    default?: FileLoader;
};

export type MetaExport = {
    default?: GroupLoader;
};

async function asyncImport(path: string) {
    return await import(pathToFileURL(path).href);
}

/**
 * @param files files to search
 */
function findMetaFile(files: string[]): [meta: string | null, nodes: string[]] {
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

async function readFile(path: string): Promise<File> {
    const { default: loader } = (await asyncImport(path)) as FileExport;

    if (loader == null) throw new Error(`Invalid loader ${path}`);

    return {
        name: parse(path).name,
        type: "file",
        path,
        loader: loader,
    };
}

async function readMeta(path: string): Promise<Meta> {
    const { default: loader } = (await asyncImport(path)) as MetaExport;

    if (loader != null && loader.type !== "group")
        throw new Error(`Invalid loader ${path}`);

    return {
        loader,
    };
}

async function readDir(dir: string): Promise<Folder | Group> {
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
