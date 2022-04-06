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
var mocha_1 = require("mocha");
var assert = require("assert/strict");
var path = require("test/unit/lib/path");
var inspector_1 = require("../../../src/lib/inspector");
var inspector;
(0, mocha_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                inspector = new inspector_1.default();
                return [4 /*yield*/, inspector.start()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, mocha_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        inspector.stop();
        return [2 /*return*/];
    });
}); });
(0, mocha_1.describe)('inspector unit test', function () {
    (0, mocha_1.it)('getRemoteGlobal', function () { return __awaiter(void 0, void 0, void 0, function () {
        var g;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inspector.getRemoteGlobal()];
                case 1:
                    g = _a.sent();
                    assert.equal(g.type, 'object');
                    assert.equal(g.className, 'global');
                    assert.equal(g.description, 'global');
                    assert.ok(g.objectId.length > 0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, mocha_1.it)('getGlobalNames', function () { return __awaiter(void 0, void 0, void 0, function () {
        var gn;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inspector.getGlobalNames()];
                case 1:
                    gn = _a.sent();
                    [
                        'global',
                        'clearInterval',
                        'Function',
                        'Array',
                        'Infinity',
                        'undefined',
                        'constructor',
                        'require',
                        'ls',
                        'cd',
                        'util',
                        '__proto__',
                    ].forEach(function (name) { return assert.ok(gn.includes(name), "Expected ".concat(name)); });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, mocha_1.it)('evaluate 1 + 1', function () { return __awaiter(void 0, void 0, void 0, function () {
        var source, actual;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    source = '1 + 1';
                    return [4 /*yield*/, inspector.evaluate(source, true)];
                case 1:
                    actual = _a.sent();
                    assert.deepStrictEqual(actual, {
                        result: {
                            description: '2',
                            type: 'number',
                            value: 2,
                        },
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, mocha_1.it)('execute 1 + 1', function () { return __awaiter(void 0, void 0, void 0, function () {
        var source, actual;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    source = '1 + 1';
                    return [4 /*yield*/, inspector.execute(source)];
                case 1:
                    actual = _a.sent();
                    assert.deepStrictEqual(actual, '2');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, mocha_1.it)('evaluate somethingThatDoesNotExist', function () { return __awaiter(void 0, void 0, void 0, function () {
        var actual;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inspector.evaluate('somethingThatDoesNotExist', true)];
                case 1:
                    actual = (_a.sent()).result;
                    // ReferenceError only when throwOnSideEffect is true
                    assert.ok(actual.description.includes('EvalError: Possible side-effect in debug-evaluate'));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, mocha_1.it)('evaluate with syntax error', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inspector.evaluate('"', true)];
                case 1:
                    res = _a.sent();
                    assert.equal(res.result.type, 'object');
                    assert.equal(res.result.className, 'SyntaxError');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, mocha_1.it)('evaluate load module', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inspector.loadModule('fs')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, inspector.evaluate('fs')];
                case 2:
                    result = (_a.sent()).result;
                    assert.equal(result.type, 'object');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, mocha_1.it)('callFunctionOn', function () { return __awaiter(void 0, void 0, void 0, function () {
        var f, actual;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    f = 'function foo(arg) { return arg; }';
                    return [4 /*yield*/, inspector.callFunctionOn(f, [{ value: 'abc' }])];
                case 1:
                    actual = _a.sent();
                    assert.deepStrictEqual(actual, {
                        result: {
                            type: 'string',
                            value: 'abc',
                        },
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, mocha_1.describe)('preview', function () {
        (0, mocha_1.it)('should not throw side effect with array', function () { return __awaiter(void 0, void 0, void 0, function () {
            var actual;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, inspector.preview('[1,2,3].map(x => x * x)')];
                    case 1:
                        actual = _a.sent();
                        assert.deepStrictEqual(actual, '[ 1, 4, 9 ]');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, mocha_1.it)('should throw side effect this ls', function () { return __awaiter(void 0, void 0, void 0, function () {
            var actual;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, inspector.preview('[\'src\', \'test\'].map(e => ls(e))')];
                    case 1:
                        actual = _a.sent();
                        assert.equal(actual, undefined);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, mocha_1.describe)('auto require', function () {
        // eslint-disable-next-line func-names
        (0, mocha_1.it)('should load fakemodule', function () {
            return __awaiter(this, void 0, void 0, function () {
                var moduleAbsPath, load, evaluation;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (process.platform === 'win32') {
                                // FIXME: should work
                                this.skip();
                            }
                            moduleAbsPath = path.join(__dirname, 'fixtures', 'inspector', 'node_modules', 'fakemodule');
                            return [4 /*yield*/, inspector.loadModule(moduleAbsPath)];
                        case 1:
                            load = _a.sent();
                            assert.ok(load.result);
                            return [4 /*yield*/, inspector.evaluate('fakemodule')];
                        case 2:
                            evaluation = _a.sent();
                            assert.equal(evaluation.result.value, 'module loaded!');
                            return [2 /*return*/];
                    }
                });
            });
        });
        (0, mocha_1.it)('should not load a module that does not exist', function () { return __awaiter(void 0, void 0, void 0, function () {
            var unknownModule, moduleAbsPath, load, evaluation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        unknownModule = 'moduleThatDoesNotExist';
                        moduleAbsPath = path.join(__dirname, 'fixtures', 'inspector', 'node_modules', unknownModule);
                        return [4 /*yield*/, inspector.loadModule(moduleAbsPath)];
                    case 1:
                        load = _a.sent();
                        assert.ok(load.result);
                        return [4 /*yield*/, inspector.evaluate(unknownModule, false)];
                    case 2:
                        evaluation = _a.sent();
                        assert.equal(evaluation.result.className, 'ReferenceError');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
