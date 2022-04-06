'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var acorn = require("acorn-loose");
var walk = require("acorn-walk");
var fs = require("fs");
var path = require("./path");
var Completer = /** @class */ (function () {
    function Completer(runner) {
        this.runner = runner;
    }
    Completer.prototype.complete = function (source, cursor) {
        return __awaiter(this, void 0, void 0, function () {
            var root, node, itemPath, matchingPaths, trailingItemPath, identifierName, matchingIdentifier, property, matchingProperties, propName, matchingFunctions;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!source) return [3 /*break*/, 2];
                        _a = {};
                        return [4 /*yield*/, this.runner.getGlobalNames()];
                    case 1: return [2 /*return*/, (_a.completions = _b.sent(),
                            _a.originalSubstring = '',
                            _a.fillable = true,
                            _a)];
                    case 2:
                        // cursor can be at position 0
                        if (cursor === undefined || cursor === null) {
                            cursor = source.length;
                        }
                        root = acorn.parse(source, { ecmaVersion: 2020 });
                        node = walk.findNodeAround(root, cursor).node;
                        if (!node) {
                            return [2 /*return*/, undefined];
                        }
                        if (node.type === 'Literal' && typeof node.value === 'string') {
                            if (cursor === node.start || (cursor === node.end && this.isCompletedString(node.raw))) {
                                return [2 /*return*/, undefined];
                            }
                            itemPath = path.normalizeCurrent(cursor === node.start + 1 ? '' : node.value);
                            matchingPaths = this.completePath(itemPath);
                            trailingItemPath = itemPath.slice(-1)[0] === '/' ? '' : path.basename(itemPath);
                            return [2 /*return*/, {
                                    completions: this.removePrefix(matchingPaths, itemPath),
                                    originalSubstring: trailingItemPath,
                                    fillable: true,
                                }];
                        }
                        if (!(node.type === 'Identifier')) return [3 /*break*/, 5];
                        identifierName = node.name.slice(0, cursor);
                        return [4 /*yield*/, this.loadModule(node.name)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, this.completeIdentifier(identifierName)];
                    case 4:
                        matchingIdentifier = _b.sent();
                        if (matchingIdentifier.length > 0) {
                            return [2 /*return*/, {
                                    completions: this.removePrefix(matchingIdentifier, identifierName),
                                    originalSubstring: identifierName,
                                    fillable: true,
                                }];
                        }
                        return [2 /*return*/, undefined];
                    case 5:
                        if (!(node.type === 'MemberExpression')) return [3 /*break*/, 7];
                        if (node.computed) {
                            return [2 /*return*/, undefined];
                        }
                        property = node.property;
                        return [4 /*yield*/, this.completeProperties(node, source, cursor)];
                    case 6:
                        matchingProperties = _b.sent();
                        propName = (cursor === property.start || property.name === '✖') ? '' : property.name;
                        return [2 /*return*/, {
                                completions: this.removePrefix(matchingProperties, propName),
                                originalSubstring: propName,
                                fillable: true,
                            }];
                    case 7:
                        if (!(node.type === 'CallExpression' || node.type === 'NewExpression')) return [3 /*break*/, 9];
                        if (source[node.end - 1] === ')') {
                            return [2 /*return*/, undefined];
                        }
                        return [4 /*yield*/, this.completeFunction(source, node)];
                    case 8:
                        matchingFunctions = _b.sent();
                        if (matchingFunctions) {
                            return [2 /*return*/, {
                                    completions: [matchingFunctions],
                                    fillable: false,
                                }];
                        }
                        _b.label = 9;
                    case 9: return [2 /*return*/, undefined];
                }
            });
        });
    };
    Completer.prototype.isCompletedString = function (string) {
        if (!string || string.length < 2) {
            return false;
        }
        var start = string[0];
        var end = string.slice(-1)[0];
        return ['\'', '"', '`'].includes(start) && start === end;
    };
    Completer.prototype.removePrefix = function (array, prefix) {
        return array.filter(function (e) { return e.startsWith(prefix); })
            .map(function (withPrefix) { return withPrefix.slice(prefix.length); })
            .filter(function (withoutPrefix) { return withoutPrefix !== ''; });
    };
    Completer.prototype.completePath = function (line) {
        var isDir = line.slice(-1) === '/';
        var dirname = isDir ? line : path.dirname(line);
        var items;
        try {
            items = fs.readdirSync(dirname);
        }
        catch (_a) {
            items = [];
        }
        var hits = items.filter(function (item) {
            var baseItem = path.basename(item);
            var baseLine = path.basename(line);
            return baseItem.startsWith(baseLine);
        });
        if (line.length > 1 && !isDir) {
            items = [];
        }
        if (hits.length === 1) {
            var hit = path.join(dirname, hits[0]);
            if (fs.statSync(hit)
                .isDirectory()) {
                hits[0] = path.join(hits[0], '/');
            }
        }
        var completions = hits.length ? hits : items;
        return completions.map(function (e) { return path.join(dirname, e); });
    };
    Completer.prototype.completeIdentifier = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var globalIds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getGlobalIdentifiers()];
                    case 1:
                        globalIds = _a.sent();
                        return [2 /*return*/, globalIds.filter(function (gid) { return gid.startsWith(id); })];
                }
            });
        });
    };
    Completer.prototype.getGlobalIdentifiers = function () {
        return this.runner.getGlobalNames();
    };
    Completer.prototype.loadModule = function (moduleName) {
        return __awaiter(this, void 0, void 0, function () {
            var localModulePath, localModule, globalModule;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        localModulePath = path.resolve(process.cwd(), 'node_modules', moduleName);
                        return [4 /*yield*/, this.runner.loadModule(localModulePath)];
                    case 1:
                        localModule = (_a.sent()).result;
                        if (localModule.type === 'object') {
                            return [2 /*return*/, true];
                        }
                        return [4 /*yield*/, this.runner.loadModule(moduleName)];
                    case 2:
                        globalModule = (_a.sent()).result;
                        return [2 /*return*/, globalModule.type === 'object'];
                }
            });
        });
    };
    Completer.prototype.completeProperties = function (node, source, cursor) {
        return __awaiter(this, void 0, void 0, function () {
            var properties, property, relativeCursor, propertyName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getProperties(node, source)];
                    case 1:
                        properties = _a.sent();
                        property = node.property;
                        relativeCursor = cursor - property.start;
                        propertyName = property.name === '✖' ? '' : property.name;
                        propertyName = propertyName.slice(0, relativeCursor);
                        return [2 /*return*/, properties.filter(function (p) { return p.startsWith(propertyName); })];
                }
            });
        });
    };
    Completer.prototype.getProperties = function (node, source) {
        return __awaiter(this, void 0, void 0, function () {
            var object, expression, evaluated, properties;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        object = node.object;
                        expression = source.slice(object.start, object.end);
                        return [4 /*yield*/, this.runner.evaluate(expression, true)];
                    case 1:
                        evaluated = _a.sent();
                        if (evaluated.exceptionDetails) {
                            return [2 /*return*/, []];
                        }
                        return [4 /*yield*/, this.runner.post('Runtime.getProperties', {
                                objectId: evaluated.result.objectId,
                                generatePreview: true,
                            })];
                    case 2:
                        properties = (_a.sent()).result;
                        return [2 /*return*/, properties.map(function (p) { return p.name; })];
                }
            });
        });
    };
    Completer.prototype.completeFunction = function (line, expression) {
        return __awaiter(this, void 0, void 0, function () {
            var callee, _a, result, exceptionDetails, annotation;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        callee = line.slice(expression.callee.start, expression.callee.end);
                        return [4 /*yield*/, this.runner.evaluate(callee, true)];
                    case 1:
                        _a = _b.sent(), result = _a.result, exceptionDetails = _a.exceptionDetails;
                        if (exceptionDetails) {
                            return [2 /*return*/, undefined];
                        }
                        return [4 /*yield*/, this.runner.callFunctionOn("function complete(fn, expression, line) {\n        const { completeCall } = require('".concat(require.resolve('../annotations'), "');\n        const a = completeCall(fn, expression, line);\n        return a;\n      }"), [result, { value: expression }, { value: line }])];
                    case 2:
                        annotation = (_b.sent()).result;
                        if (annotation.type === 'string') {
                            return [2 /*return*/, annotation.value];
                        }
                        return [2 /*return*/, undefined];
                }
            });
        });
    };
    return Completer;
}());
exports.default = Completer;
