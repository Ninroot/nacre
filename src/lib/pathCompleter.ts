import path = require('path');
import * as fs from 'fs';

export type Completion = [string[], string];

function completer(line: string, type?: 'file' | 'directory'): Completion {
  if (line === undefined || line === null) {
    return undefined;
  }

  const isDir = line.slice(-1) === '/';
  const dirname = isDir ? line : path.dirname(line);

  let items: string[];
  try {
    items = fs.readdirSync(dirname);
    if (type === 'file') {
      items = items.filter((item) => fs.lstatSync(item).isFile());
    } else if (type === 'directory') {
      items = items.filter((item) => fs.lstatSync(item).isDirectory());
    }
  } catch {
    items = [];
  }

  const hits = items.filter((item) => {
    const baseItem = path.basename(item);
    const baseLine = path.basename(line);
    return baseItem.startsWith(baseLine);
  });

  if (line.length > 1 && !isDir) {
    items = [];
  }

  if (hits.length === 1) {
    const hit = path.join(dirname, hits[0]);
    if (fs.statSync(hit).isDirectory()) {
      hits[0] = path.join(hits[0], '/');
    }
  }

  const completions = hits.length ? hits : items;
  return [completions, path.basename(line)];
}

export function itemPathCompleter(line: string): Completion {
  return completer(line);
}

export function filePathCompleter(line: string): Completion {
  return completer(line, 'file');
}

export function dirPathCompleter(line: string): Completion {
  return completer(line, 'directory');
}
