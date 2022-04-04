'use strict';

import {appendFileSync, readFileSync, writeFileSync} from "fs";
import {EOL} from "os";


// Open file for reading. An exception occurs if the file does not exist.
const cat = (filepath) => readFileSync(filepath, {
    encoding: 'utf-8',
    flag: 'r',
});

cat.lines = (filepath) => cat(filepath).split(EOL);

// Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
cat.truncated = (filepath, string) => {
    writeFileSync(filepath, string, {
        encoding: 'utf8',
        flag: 'w',
    });
    return string;
};

// Appends in synchronous mode. The file is created if it does not exist.
cat.append = (filepath, string) => {
    appendFileSync(filepath, string, {
        encoding: 'utf8',
        flag: 'as+',
    });
    return cat(filepath);
};

export = cat;
