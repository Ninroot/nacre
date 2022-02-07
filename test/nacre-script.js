#!/usr/bin/env nacre

'use strict';

/**
 * This is a file which demonstrates that nacre can also run a script file like NodeJS!
 */

const everyone = ls.recursive();

const onlyFiles = everyone.filter(item => {
  const info = stat(item);
  return info.type === 'file';
});

console.log(onlyFiles);

const onlyJs = onlyFiles.filter((f) => f.endsWith('.js'));

console.log(onlyJs);
