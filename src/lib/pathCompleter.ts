import path = require('./path');
import * as fs from 'fs';

export type Completion = [string[], string];

function pathCompleter(line: string, dirOnly?: boolean): Completion {
  if (line === undefined || line === null) {
    return undefined;
  }

  // 0. make sure line is sanitized from windows escapes
  line = process.platform === 'win32' ? line.split('\\\\').join('\\') : line;

  // 1. get the path of the targeted directory
  const targetDir = path.dirPath(line);

  // 2. fetch items of target directory
  let targetItems: string[];
  try {
    // Get items of the target directory
    targetItems = fs.readdirSync(targetDir);
    if (dirOnly) {
      targetItems = targetItems.filter((item) => {
        const itemPath = path.join(targetDir, item);
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
  const itemToMatch = path.isDir(line) ? '' : path.basename(line);

  // 4. filter target items
  const hits = targetItems.filter((item) => item.startsWith(itemToMatch));

  // 5. Add extra separator when the only matching item is a directory
  if (hits.length === 1) {
    const hit = path.join(targetDir, hits[0]);
    if (fs.statSync(hit).isDirectory()) {
      if (process.platform === 'win32') {
        // Windows backslash need to be escaped in JS string. Eg: 'foo\\bar'
        hits[0] += '\\\\';
      } else {
        hits[0] += '/';
      }
    }
  }

  // 6. hits and the substring that was used for the matching
  return [hits, itemToMatch];
}

export function itemPathCompleter(line: string): Completion {
  return pathCompleter(line);
}


export function dirPathCompleter(line: string): Completion {
  return pathCompleter(line, true);
}
