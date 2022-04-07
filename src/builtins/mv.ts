import stat = require("./stat");
import path = require("path");
import { renameSync } from "fs";

type movedItem = {
    oldPath: string;
    newPath: string;
}

const mv = function (itemPath: string, dirPath: string): movedItem {
    const dirStat = stat(dirPath);
    if(dirStat.type !== 'directory') {
        throw new Error(`Item can only be moved in a directory. The type of ${ dirPath }: ${ dirStat.type }.`);
    }
    const newPath = path.join(dirPath, path.basename(itemPath));

    try {
        stat(newPath);
    } catch {
        renameSync(itemPath, newPath);
        return {
            oldPath: itemPath,
            newPath
        };
    }
    throw new Error(`Item already exists in the destination directory: ${ newPath }.`)
};

export = mv;
