import { LocalizationMap } from "discord.js";
import { FileLoader, GroupLoader } from "./core";

export type ApplicationCommandConfig = {
    name?: string;
    names?: LocalizationMap;

    /**
     * Permissions settings
     *
     * It will be ignored if used inside a command group
     */
    scope?: Partial<{
        dm: boolean;
        member: number | string | bigint;
    }>;
};

export type DescriptionConfig = {
    description: string;
    descriptions?: LocalizationMap;
};

/**
 * base unit
 */
export type Node = File | Group | Folder;

/**
 * A file
 */
export type File = {
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
    loader: GroupLoader;
};

/**
 * A dir with _meta file
 */
export type Group = {
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
