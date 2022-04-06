'use strict';
var _chmod_1 = require("./lib/_chmod");
var process_1 = require("process");
// GET
var chmod = function (itemPath) { return (0, _chmod_1.getMode)(itemPath); };
// ADD
chmod.add = function (itemPath) { return (0, _chmod_1.addPerm)(itemPath, 511); };
chmod.add.read = function (itemPath) { return (0, _chmod_1.addPerm)(itemPath, 292); };
chmod.add.read.user = function (itemPath) { return (0, _chmod_1.addPerm)(itemPath, 256); };
chmod.add.read.group = function (itemPath) { return (0, _chmod_1.addPerm)(itemPath, 32); };
chmod.add.read.others = function (itemPath) { return (0, _chmod_1.addPerm)(itemPath, 4); };
chmod.add.write = function (itemPath) { return (0, _chmod_1.addPerm)(itemPath, 146); };
chmod.add.write.user = function (itemPath) { return (0, _chmod_1.addPerm)(itemPath, 128); };
chmod.add.write.group = function (itemPath) { return (0, _chmod_1.addPerm)(itemPath, 16); };
chmod.add.write.others = function (itemPath) { return (0, _chmod_1.addPerm)(itemPath, 2); };
chmod.add.execute = function (itemPath) { return (0, _chmod_1.addPerm)(itemPath, 73); };
chmod.add.execute.user = function (itemPath) { return (0, _chmod_1.addPerm)(itemPath, 64); };
chmod.add.execute.group = function (itemPath) { return (0, _chmod_1.addPerm)(itemPath, 8); };
chmod.add.execute.others = function (itemPath) { return (0, _chmod_1.addPerm)(itemPath, 1); };
// REMOVE
chmod.remove = function (itemPath) { return (0, _chmod_1.removePerm)(itemPath, 0); };
chmod.remove.read = function (itemPath) { return (0, _chmod_1.removePerm)(itemPath, 292); };
chmod.remove.read.user = function (itemPath) { return (0, _chmod_1.removePerm)(itemPath, 256); };
chmod.remove.read.group = function (itemPath) { return (0, _chmod_1.removePerm)(itemPath, 32); };
chmod.remove.read.others = function (itemPath) { return (0, _chmod_1.removePerm)(itemPath, 4); };
chmod.remove.write = function (itemPath) { return (0, _chmod_1.removePerm)(itemPath, 146); };
chmod.remove.write.user = function (itemPath) { return (0, _chmod_1.removePerm)(itemPath, 128); };
chmod.remove.write.group = function (itemPath) { return (0, _chmod_1.removePerm)(itemPath, 16); };
chmod.remove.write.others = function (itemPath) { return (0, _chmod_1.removePerm)(itemPath, 2); };
chmod.remove.execute = function (itemPath) { return (0, _chmod_1.removePerm)(itemPath, 73); };
chmod.remove.execute.user = function (itemPath) { return (0, _chmod_1.removePerm)(itemPath, 64); };
chmod.remove.execute.group = function (itemPath) { return (0, _chmod_1.removePerm)(itemPath, 8); };
chmod.remove.execute.others = function (itemPath) { return (0, _chmod_1.removePerm)(itemPath, 1); };
// SET
chmod.set = function (itemPath, perm) {
    if (perm === null || perm === undefined) {
        throw Error("Expect perm to be defined. Actual: ".concat(perm));
    }
    return (0, _chmod_1.setMode)(itemPath, (0, _chmod_1.modeToOctal)(perm));
};
chmod.set.read = function (itemPath) { return (0, _chmod_1.setMode)(itemPath, 292); };
chmod.set.read.user = function (itemPath) { return (0, _chmod_1.setMode)(itemPath, 256); };
chmod.set.read.group = function (itemPath) { return (0, _chmod_1.setMode)(itemPath, 32); };
chmod.set.read.others = function (itemPath) { return (0, _chmod_1.setMode)(itemPath, 4); };
chmod.set.write = function (itemPath) { return (0, _chmod_1.setMode)(itemPath, 146); };
chmod.set.write.user = function (itemPath) { return (0, _chmod_1.setMode)(itemPath, 128); };
chmod.set.write.group = function (itemPath) { return (0, _chmod_1.setMode)(itemPath, 16); };
chmod.set.write.others = function (itemPath) { return (0, _chmod_1.setMode)(itemPath, 2); };
chmod.set.execute = function (itemPath) { return (0, _chmod_1.setMode)(itemPath, 73); };
chmod.set.execute.user = function (itemPath) { return (0, _chmod_1.setMode)(itemPath, 64); };
chmod.set.execute.group = function (itemPath) { return (0, _chmod_1.setMode)(itemPath, 8); };
chmod.set.execute.others = function (itemPath) { return (0, _chmod_1.setMode)(itemPath, 1); };
module.exports = (process_1.platform === 'win32') ? undefined : chmod;
