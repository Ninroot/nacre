'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeCall = exports.generateAnnotationForJsFunction = void 0;
var fs = require("fs");
var path = require("path");
var Module = require("module");
var acorn = require("acorn");
var annotationMap = require("./annotation_map.js");
function generateAnnotationForJsFunction(method) {
    var description = method.toString();
    if (description.includes('{ [native function] }')) {
        return false;
    }
    var expr = null;
    try {
        // any: acorn does not have all types defined
        // Try to parse as a function, anonymous function, or arrow function.
        var parsed = acorn.parse("(".concat(description, ")"), { ecmaVersion: 2020 });
        expr = parsed.body[0].expression;
    }
    catch (_a) {
        try {
            // Try to parse as a method.
            var parsed = acorn.parse("({".concat(description, "})"), { ecmaVersion: 2020 });
            expr = parsed.body[0].expression;
        }
        catch (_b) { } // eslint-disable-line no-empty
    }
    if (!expr) {
        return false;
    }
    var params;
    switch (expr.type) {
        case 'ClassExpression': {
            if (!expr.body.body) {
                break;
            }
            var constructor = expr.body.body.find(function (m) { return m.kind === 'constructor'; });
            if (constructor) {
                (params = constructor.value.params);
            }
            break;
        }
        case 'ObjectExpression':
            if (!expr.properties[0] || !expr.properties[0].value) {
                break;
            }
            (params = expr.properties[0].value.params);
            break;
        case 'FunctionExpression':
        case 'ArrowFunctionExpression':
            (params = expr.params);
            break;
        default:
            break;
    }
    if (!params) {
        return false;
    }
    params = params.map(function paramName(param) {
        switch (param.type) {
            case 'Identifier':
                return param.name;
            case 'AssignmentPattern':
                return "?".concat(paramName(param.left));
            case 'ObjectPattern': {
                var list = param.properties.map(function (p) {
                    var k = paramName(p.key);
                    var v = paramName(p.value);
                    if (k === v) {
                        return k;
                    }
                    if ("?".concat(k) === v) {
                        return "?".concat(k);
                    }
                    return "".concat(k, ": ").concat(v);
                }).join(', ');
                return "{ ".concat(list, " }");
            }
            case 'ArrayPattern': {
                var list = param.elements.map(paramName).join(', ');
                return "[ ".concat(list, " ]");
            }
            case 'RestElement':
                return "...".concat(paramName(param.argument));
            default:
                return '?';
        }
    });
    annotationMap.set(method, { call: [params], construct: [params] });
    return true;
}
exports.generateAnnotationForJsFunction = generateAnnotationForJsFunction;
function gracefulOperation(fn, args, alternative) {
    try {
        return fn.apply(void 0, args);
    }
    catch (_a) {
        return alternative;
    }
}
function completeCall(method, expression, buffer) {
    if (method === globalThis.require) {
        if (expression.arguments.length > 1) {
            return ')';
        }
        if (expression.arguments.length === 1) {
            var a = expression.arguments[0];
            if (a.type !== 'Literal' || typeof a.value !== 'string'
                || /['"]$/.test(a.value)) {
                return undefined;
            }
        }
        var extensions_1 = Object.keys(require.extensions);
        var indexes_1 = extensions_1.map(function (extension) { return "index".concat(extension); });
        indexes_1.push('package.json', 'index');
        var versionedFileNamesRe_1 = /-\d+\.\d+/;
        var completeOn = expression.arguments[0].value;
        var subdir_1 = /([\w@./-]+\/)?(?:[\w@./-]*)/m.exec(completeOn)[1] || '';
        var group_2 = [];
        var paths = [];
        if (completeOn === '.') {
            group_2 = ['./', '../'];
        }
        else if (completeOn === '..') {
            group_2 = ['../'];
        }
        else if (/^\.\.?\//.test(completeOn)) {
            paths = [process.cwd()];
        }
        else {
            // TODO make it nicer?
            // globalPaths definition not present in Module(?)
            var globalPaths = Module.globalPaths;
            paths = module.paths.concat(globalPaths);
        }
        paths.forEach(function (dir) {
            dir = path.resolve(dir, subdir_1);
            gracefulOperation(fs.readdirSync, [dir, { withFileTypes: true }], []).forEach(function (dirent) {
                if (versionedFileNamesRe_1.test(dirent.name) || dirent.name === '.npm') {
                    // Exclude versioned names that 'npm' installs.
                    return;
                }
                var extension = path.extname(dirent.name);
                var base = dirent.name.slice(0, -extension.length);
                if (!dirent.isDirectory()) {
                    if (extensions_1.includes(extension) && (!subdir_1 || base !== 'index')) {
                        group_2.push("".concat(subdir_1).concat(base));
                    }
                    return;
                }
                group_2.push("".concat(subdir_1).concat(dirent.name, "/"));
                var absolute = path.resolve(dir, dirent.name);
                var subfiles = gracefulOperation(fs.readdirSync, [absolute], []);
                for (var _i = 0, subfiles_1 = subfiles; _i < subfiles_1.length; _i++) {
                    var subfile = subfiles_1[_i];
                    if (indexes_1.includes(subfile)) {
                        group_2.push("".concat(subdir_1).concat(dirent.name));
                        break;
                    }
                }
            });
        });
        for (var _i = 0, group_1 = group_2; _i < group_1.length; _i++) {
            var g = group_1[_i];
            if (g.startsWith(completeOn)) {
                return g.slice(completeOn.length);
            }
        }
        return undefined;
    }
    if (!annotationMap.has(method)) {
        if (!generateAnnotationForJsFunction(method)) {
            return undefined;
        }
    }
    var entry = annotationMap.get(method)[{
        CallExpression: 'call',
        NewExpression: 'construct',
    }[expression.type]].slice(0);
    var target = expression.arguments.length + (buffer.trim().endsWith(',') ? 1 : 0);
    var params = entry.find(function (p) { return p.length >= target; }) || entry.at(-1);
    if (target >= params.length) {
        if (params[params.length - 1].startsWith('...')) {
            return ", ".concat(params[params.length - 1]);
        }
        return ')';
    }
    params = params.slice(target).join(', ');
    if (target > 0) {
        if (buffer.trim().endsWith(',')) {
            var spaces = buffer.length - (buffer.lastIndexOf(',') + 1);
            if (spaces > 0) {
                return params;
            }
            return " ".concat(params);
        }
        return ", ".concat(params);
    }
    return params;
}
exports.completeCall = completeCall;
