'use strict';
var fs = require("fs");
var path = require("path");
// design decision
// when a filename is given to  ls, it will throw an error in order to:
// distinguish a directory from a file within the directory (ex: foo vs foo/foo)
var ls = function (dirpath) {
    var p = dirpath || '.';
    var items = fs.readdirSync(p);
    return items.map(function (item) { return path.join(p, item); });
};
ls.help = 'List directory';
ls.recursive = function (dirpath) {
    var walk = function (dir) {
        var results = [];
        var list = fs.readdirSync(dir);
        list.forEach(function (file) {
            file = path.join(dir, file);
            var stat = fs.lstatSync(file);
            results.push(file);
            if (stat && stat.isDirectory()) {
                results = results.concat(walk(file));
            }
        });
        return results;
    };
    return walk(dirpath || '.');
};
ls.recursive.help = 'List directory recursively';
module.exports = ls;
