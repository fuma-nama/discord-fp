import { lstatSync, readdirSync } from "fs";
import { join, parse } from "path";
import { CommandFile, MetaFile } from "../core";

export type FileOrMeta =
    | {
          type: "none";
          data?: undefined;
      }
    | {
          type: "meta";
          data: MetaFile;
      }
    | {
          type: "file";
          data: CommandFile;
      };
/**
 *
 * @param path The full path of file/dir
 * @returns Read command file, or _meta if it's a dir
 */
export async function readFileOrMeta(path: string): Promise<FileOrMeta> {
    if (lstatSync(path).isDirectory()) {
        const meta = findMetaFile(path, readdirSync(path));
        if (meta == null)
            return {
                type: "none",
            };

        const data = (await import(meta)).default as MetaFile | undefined;
        if (data == null) return { type: "none" };

        return {
            type: "meta",
            data: data,
        };
    } else {
        const data = (await import(path)).default as CommandFile | undefined;
        if (data == null) return { type: "none" };

        return {
            type: "file",
            data: data,
        };
    }
}

/**
 *
 * @param dir The path of dir
 * @param files files to search
 * @returns The full path of _meta file
 */
export function findMetaFile(dir: string, files: string[]) {
    const meta = files.find((file) => parse(file).name === "_meta");

    if (meta == null) return null;
    return join(dir, meta);
}
