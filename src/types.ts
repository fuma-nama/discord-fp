import { Interaction, LocalizationMap } from "discord.js";
import { FileLoader, GroupLoader } from "./core/loader.js";
import { Middleware } from "./middleware/index.js";

export type FileExport = {
    default?: FileLoader;
};

export type MetaExport = {
    middleware?: (e: Interaction) => void;
    default?: GroupLoader;
};

export type ApplicationCommandConfig = {
    name?: string;
    names?: LocalizationMap;

    /**
     * Permissions settings
     *
     * It will be ignored if used inside a command group
     */
    scope?: Partial<{
        /**
         * DM permissions
         */
        dm: boolean;

        /**
         * Member default permissions
         */
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
    middleware?: Middleware;
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
