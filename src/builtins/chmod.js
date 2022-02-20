'use strict';

const { addPerm, removePerm, getMode, setMode, modeToOctal } = require('./lib/_chmod');

// GET
const chmod = (itemPath) => getMode(itemPath);

// ADD
chmod.add = (itemPath) => addPerm(itemPath, 0o777);
chmod.add.read = (itemPath) => addPerm(itemPath, 0o444);
chmod.add.read.user = (itemPath) => addPerm(itemPath, 0o400);
chmod.add.read.group = (itemPath) => addPerm(itemPath, 0o040);
chmod.add.read.others = (itemPath) => addPerm(itemPath, 0o004);
chmod.add.write = (itemPath) => addPerm(itemPath, 0o222);
chmod.add.write.user = (itemPath) => addPerm(itemPath, 0o200);
chmod.add.write.group = (itemPath) => addPerm(itemPath, 0o020);
chmod.add.write.others = (itemPath) => addPerm(itemPath, 0o002);
chmod.add.execute = (itemPath) => addPerm(itemPath, 0o111);
chmod.add.execute.user = (itemPath) => addPerm(itemPath, 0o100);
chmod.add.execute.group = (itemPath) => addPerm(itemPath, 0o010);
chmod.add.execute.others = (itemPath) => addPerm(itemPath, 0o001);

// REMOVE
chmod.remove = (itemPath) => removePerm(itemPath, 0o000);
chmod.remove.read = (itemPath) => removePerm(itemPath, 0o444);
chmod.remove.read.user = (itemPath) => removePerm(itemPath, 0o400);
chmod.remove.read.group = (itemPath) => removePerm(itemPath, 0o040);
chmod.remove.read.others = (itemPath) => removePerm(itemPath, 0o004);
chmod.remove.write = (itemPath) => removePerm(itemPath, 0o222);
chmod.remove.write.user = (itemPath) => removePerm(itemPath, 0o200);
chmod.remove.write.group = (itemPath) => removePerm(itemPath, 0o020);
chmod.remove.write.others = (itemPath) => removePerm(itemPath, 0o002);
chmod.remove.execute = (itemPath) => removePerm(itemPath, 0o111);
chmod.remove.execute.user = (itemPath) => removePerm(itemPath, 0o100);
chmod.remove.execute.group = (itemPath) => removePerm(itemPath, 0o010);
chmod.remove.execute.others = (itemPath) => removePerm(itemPath, 0o001);

// SET
chmod.set = (itemPath, perm) => {
  if (perm === null || perm === undefined) {
    throw Error(`Expect perm to be defined. Actual: ${perm}`);
  }
  return setMode(itemPath, modeToOctal(perm));
};
chmod.set.read = (itemPath) => setMode(itemPath, 0o444);
chmod.set.read.user = (itemPath) => setMode(itemPath, 0o400);
chmod.set.read.group = (itemPath) => setMode(itemPath, 0o040);
chmod.set.read.others = (itemPath) => setMode(itemPath, 0o004);
chmod.set.write = (itemPath) => setMode(itemPath, 0o222);
chmod.set.write.user = (itemPath) => setMode(itemPath, 0o200);
chmod.set.write.group = (itemPath) => setMode(itemPath, 0o020);
chmod.set.write.others = (itemPath) => setMode(itemPath, 0o002);
chmod.set.execute = (itemPath) => setMode(itemPath, 0o111);
chmod.set.execute.user = (itemPath) => setMode(itemPath, 0o100);
chmod.set.execute.group = (itemPath) => setMode(itemPath, 0o010);
chmod.set.execute.others = (itemPath) => setMode(itemPath, 0o001);

module.exports = chmod;
