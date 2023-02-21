import type { Interaction } from "discord.js";
import type { LocalizationMap } from "discord.js";
import type { FileLoader, GroupLoader } from "./core/loader.js";

export type Event<E extends Interaction, Context> = {
    event: E;
    ctx: Context;
};

export type FileExport = {
    default?: FileLoader;
};

export type MetaExport = {
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
