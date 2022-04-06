'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.setMode = exports.getMode = exports.removePerm = exports.addPerm = exports.modeToOctal = exports.getPerm = void 0;
var fs_1 = require("fs");
var mod_1 = require("./mod");
function getPerm(octal) {
    var getPermByBit = function (bit) {
        switch (bit) {
            case '0': return { read: false, write: false, execute: false };
            case '1': return { read: false, write: false, execute: true };
            case '2': return { read: false, write: true, execute: false };
            case '3': return { read: false, write: true, execute: true };
            case '4': return { read: true, write: false, execute: false };
            case '5': return { read: true, write: false, execute: true };
            case '6': return { read: true, write: true, execute: false };
            case '7': return { read: true, write: true, execute: true };
            default: return {};
        }
    };
    return {
        user: getPermByBit(octal.slice(-3, -2)),
        group: getPermByBit(octal.slice(-2, -1)),
        others: getPermByBit(octal.slice(-1)),
    };
}
exports.getPerm = getPerm;
function modeToOctal(mode) {
    if (mode === null || mode === undefined) {
        return undefined;
    }
    var octal = 0;
    if (mode.user) {
        if (mode.user.execute) {
            octal = (0, mod_1.add)(octal, 64);
        }
        if (mode.user.write) {
            octal = (0, mod_1.add)(octal, 130);
        }
        if (mode.user.read) {
            octal = (0, mod_1.add)(octal, 256);
        }
    }
    if (mode.group) {
        if (mode.group.execute) {
            octal = (0, mod_1.add)(octal, 8);
        }
        if (mode.group.write) {
            octal = (0, mod_1.add)(octal, 16);
        }
        if (mode.group.read) {
            octal = (0, mod_1.add)(octal, 32);
        }
    }
    if (mode.others) {
        if (mode.others.execute) {
            octal = (0, mod_1.add)(octal, 1);
        }
        if (mode.others.write) {
            octal = (0, mod_1.add)(octal, 2);
        }
        if (mode.others.read) {
            octal = (0, mod_1.add)(octal, 4);
        }
    }
    return octal;
}
exports.modeToOctal = modeToOctal;
function addPerm(itemPath, mode) {
    var newMode = (0, mod_1.add)((0, fs_1.statSync)(itemPath).mode, mode);
    (0, fs_1.chmodSync)(itemPath, newMode);
    return getPerm(newMode.toString(8));
}
exports.addPerm = addPerm;
function removePerm(itemPath, mode) {
    var newMode = (0, mod_1.remove)((0, fs_1.statSync)(itemPath).mode, mode);
    (0, fs_1.chmodSync)(itemPath, newMode);
    return getPerm(newMode.toString(8));
}
exports.removePerm = removePerm;
function getMode(itemPath) {
    var octalPerm = (0, fs_1.statSync)(itemPath).mode.toString(8);
    return getPerm(octalPerm);
}
exports.getMode = getMode;
function setMode(itemPath, mode) {
    (0, fs_1.chmodSync)(itemPath, mode);
    return getPerm(mode.toString(8));
}
exports.setMode = setMode;
