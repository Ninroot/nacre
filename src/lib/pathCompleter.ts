import path = require('./path');
import * as fs from 'fs';

export type Completion = [string[], string];

function completer2(line: string, dirOnly?: boolean): Completion {
  if (line === undefined || line === null) {
    return undefined;
  }

  // 0. make sure line is posix
  const posixLine = line.split(path.sep).join(path.posix.sep);

  // 1. get the path of the targeted directory
  const targetDir = path.dirPath(posixLine);

  // 2. fetch items of target directory
  let targetItems: string[];
  try {
    // Get items of the target directory
    targetItems = fs.readdirSync(targetDir);
    if (dirOnly) {
      targetItems = targetItems.filter((item) => {
        const itemPath = path.posix.join(targetDir, item);
        return fs.lstatSync(itemPath).isDirectory();
      });
    }
  } catch {
    targetItems = [];
  }

  // 3. set item to match
  // '' => ''
  // 'foo' => 'foo'
  // 'foo/bar' => 'bar'
  // 'foo/' => ''
  // 'foo/.' => '.'
  // 'foo/..' => '..'
  // '.' => '.'
  // '..' => '..'
  // './' => ''
  // '/' => ''
  const itemToMatch = path.isDir(posixLine) ? '' : path.posix.basename(posixLine);

  // 4. filter target items
  const hits = targetItems.filter((item) => item.startsWith(itemToMatch));

  // 5. Add extra '/' when the only matching item is a directory
  if (hits.length === 1) {
    const hit = path.posix.join(targetDir, hits[0]);
    if (fs.statSync(hit).isDirectory()) {
      hits[0] = path.posix.join(hits[0], '/');
    }
  }

  // 6. hits and the substring that was used for the matching
  return [hits, itemToMatch];
}

export function itemPathCompleter(line: string): Completion {
  return completer2(line);
}


export function dirPathCompleter(line: string): Completion {
  return completer2(line, true);
}
