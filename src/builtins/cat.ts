'use strict';

import { appendFileSync, readFileSync, writeFileSync } from 'fs';

/**
 * Open file for reading.
 * @param filePath - path of the file to be read.
 * @return - the content of the file formatted in utf-8.
 */
const cat = (filePath: string): string => readFileSync(filePath, {
  encoding: 'utf-8',
  flag: 'r',
});

/**
 * Open file for reading but returns the contents of the file as an array of lines.
 * @param filePath - path of the file to be read.
 * @return - the content of the file formatted in utf-8 as an array of lines.
 * @see cat
 */
cat.lines = (filePath: string): string[] => cat(filePath).split(/\r?\n/);

/**
 * Append the content to the file. Create the file if it does not exist.
 * @param filePath - path of the file to be appended.
 * @param content - content to append to the file.
 * @return - entire content of the file.
 */
cat.append = (filePath: string, content: string) => {
  appendFileSync(filePath, content, {
    encoding: 'utf8',
    flag: 'as+',
  });
  return cat(filePath);
};

/**
 * Overwrites the content of the file. Create the file if it does not exist.
 * @param filePath - path of the file to be overwritten.
 * @param content - content to write in the file.
 * @return - entire content of the file.
 */
cat.overwrite = (filePath: string, content: string) => {
  writeFileSync(filePath, content, {
    encoding: 'utf8',
    flag: 'w',
  });
  return content;
};

export = cat;
