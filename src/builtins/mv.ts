import stat = require('./stat');
import path = require('path');
import { renameSync } from 'fs';

/**
 * @property oldPath - old path of the moved item
 * @property newPath - new path of the moved item
 */
type MovedItem = {
  oldPath: string;
  newPath: string;
};

/**
 * Move the item from `itemPath` to the directory `dirPath`.
 * @param itemPath - source item to be moved
 * @param dirPath - destination directory
 */
const mv = function (itemPath: string, dirPath: string): MovedItem {
  const dirStat = stat(dirPath);
  if (dirStat.type !== 'directory') {
    throw new Error(`Item can only be moved in a directory. The type of ${dirPath}: ${dirStat.type}.`);
  }
  const newPath = path.join(dirPath, path.basename(itemPath));

  try {
    stat(newPath);
  } catch {
    renameSync(itemPath, newPath);
    return {
      oldPath: itemPath,
      newPath,
    };
  }
  throw new Error(`Item already exists in the destination directory: ${newPath}.`);
};

export = mv;
