'use strict';
var os = require("os");
var flip = os.homedir();
var cd = function (path) {
    flip = process.cwd();
    if (!path) {
        return cd.home();
    }
    try {
        process.chdir(path || '.');
        return process.cwd();
    }
    catch (err) {
        return err;
    }
};
cd.help = 'Change directory';
cd.home = function () { return cd(os.homedir()); };
cd.home.help = 'Brings you in your home directory';
cd.previous = function () { return cd(flip); };
cd.previous.help = 'Brings you back to your previous location';
module.exports = cd;
