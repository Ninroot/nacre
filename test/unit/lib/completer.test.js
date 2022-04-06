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
var completer_1 = require("../../../src/lib/completer");
var inspector_1 = require("../../../src/lib/inspector");
var assert = require("assert/strict");
var path = require("test/unit/lib/path");
var builtins_1 = require("../../../src/builtins");
var windows = process.platform === 'win32';
var runner;
var completer;
var cwd;
(0, mocha_1.before)('save current working directory', function () {
    cwd = process.cwd();
});
(0, mocha_1.after)('restore current working directory', function () {
    process.chdir(cwd);
});
(0, mocha_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                (0, builtins_1.cd)(path.join(__dirname, 'fixtures', 'completer'));
                runner = new inspector_1.default();
                return [4 /*yield*/, runner.start()];
            case 1:
                _a.sent();
                completer = new completer_1.default(runner);
                return [2 /*return*/];
        }
    });
}); });
(0, mocha_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        runner.stop();
        return [2 /*return*/];
    });
}); });
(0, mocha_1.describe)('completer unit test', function () {
    (0, mocha_1.it)('Remove prefix', function () {
        var actual = completer.removePrefix(['abc', 'abcdeabc', ''], 'abc');
        assert.deepStrictEqual(actual, ['deabc']);
    });
    (0, mocha_1.it)('isCompletedString', function () {
        assert.equal(completer.isCompletedString('"hello"'), true);
        assert.equal(completer.isCompletedString('"hello'), false);
        assert.equal(completer.isCompletedString('"hello\''), false);
        assert.equal(completer.isCompletedString('""'), true);
        assert.equal(completer.isCompletedString('"'), false);
    });
    (0, mocha_1.it)('No source', function () { return __awaiter(void 0, void 0, void 0, function () {
        var completions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, completer.complete()];
                case 1:
                    completions = (_a.sent()).completions;
                    ['global', 'Array', '__proto__', 'require']
                        .forEach(function (prop) { return assert.ok(completions.includes(prop), "should include ".concat(prop)); });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, mocha_1.it)('"|', function () { return __awaiter(void 0, void 0, void 0, function () {
        var completions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, completer.complete('"')];
                case 1:
                    completions = (_a.sent()).completions;
                    ['dire1', 'dire2', 'file1.md', 'file2.md']
                        .forEach(function (file) { return assert.ok(completions.includes(file), "should include ".concat(file)); });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, mocha_1.it)('number 123|', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, completer.complete('123')];
                case 1:
                    res = _a.sent();
                    assert.equal(res, undefined);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, mocha_1.it)('thisShouldBeUnknown|', function () { return __awaiter(void 0, void 0, void 0, function () {
        var actual;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, completer.complete('thisShouldBeUnknown')];
                case 1:
                    actual = _a.sent();
                    assert.equal(actual, undefined);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, mocha_1.it)('1 < 2|', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = assert).equal;
                    return [4 /*yield*/, completer.complete('1 < 2')];
                case 1:
                    _b.apply(_a, [_c.sent(), undefined]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, mocha_1.it)('a = { [computed]: 1 }|', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = assert).equal;
                    return [4 /*yield*/, completer.complete('a = { [computed]: 1 }')];
                case 1:
                    _b.apply(_a, [_c.sent(), undefined]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, mocha_1.it)('a[1]|', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = assert).equal;
                    return [4 /*yield*/, completer.complete('a[1]')];
                case 1:
                    _b.apply(_a, [_c.sent(), undefined]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, mocha_1.it)('namedFun(x) { return x}|', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = assert).equal;
                    return [4 /*yield*/, completer.complete('function namedFun(x) { return x}')];
                case 1:
                    _b.apply(_a, [_c.sent(), undefined]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, mocha_1.it)('"|"', function () { return __awaiter(void 0, void 0, void 0, function () {
        var completions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, completer.complete('""', 1)];
                case 1:
                    completions = (_a.sent()).completions;
                    ['dire1', 'dire2', 'file1.md', 'file2.md']
                        .forEach(function (file) { return assert.ok(completions.includes(file), "should include ".concat(file)); });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, mocha_1.it)('|"di"', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, completer.complete('"di"', 0)];
                case 1:
                    res = _a.sent();
                    assert.equal(res, undefined);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, mocha_1.it)('"di|"', function () { return __awaiter(void 0, void 0, void 0, function () {
        var actual;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, completer.complete('"di"', 3)];
                case 1:
                    actual = _a.sent();
                    assert.deepStrictEqual(actual, {
                        completions: ['re1', 're2'],
                        originalSubstring: 'di',
                        fillable: true,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, mocha_1.it)('"./|"', function () { return __awaiter(void 0, void 0, void 0, function () {
        var completions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, completer.complete('"./"', 3)];
                case 1:
                    completions = (_a.sent()).completions;
                    ['dire1', 'dire2', 'file1.md', 'file2.md']
                        .forEach(function (file) { return assert.ok(completions.includes(file), "should include ".concat(file)); });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, mocha_1.it)('"./dir|"', function () { return __awaiter(void 0, void 0, void 0, function () {
        var completions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, completer.complete('"./dir"', 6)];
                case 1:
                    completions = (_a.sent()).completions;
                    assert.deepEqual(completions, ['e1', 'e2']);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, mocha_1.it)('ls("dire1/"|', function () { return __awaiter(void 0, void 0, void 0, function () {
        var actual;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, completer.complete('ls("dire1/"')];
                case 1:
                    actual = _a.sent();
                    assert.equal(actual, undefined);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, mocha_1.it)('"|whatever"', function () { return __awaiter(void 0, void 0, void 0, function () {
        var completions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, completer.complete('"whatever"', 1)];
                case 1:
                    completions = (_a.sent()).completions;
                    ['dire1', 'dire2', 'file1.md', 'file2.md']
                        .forEach(function (file) { return assert.ok(completions.includes(file), "should include ".concat(file)); });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, mocha_1.it)('con|', function () { return __awaiter(void 0, void 0, void 0, function () {
        var actual;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, completer.complete('con')];
                case 1:
                    actual = _a.sent();
                    assert.deepEqual(actual, {
                        completions: ['text', 'sole', 'structor'],
                        originalSubstring: 'con',
                        fillable: true,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, mocha_1.it)('console.|', function () { return __awaiter(void 0, void 0, void 0, function () {
        var completions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, completer.complete('console.')];
                case 1:
                    completions = (_a.sent()).completions;
                    ['log', 'dir', 'warn', '__proto__']
                        .forEach(function (prop) { return assert.ok(completions.includes(prop), "should include ".concat(prop)); });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, mocha_1.it)('console.l|', function () { return __awaiter(void 0, void 0, void 0, function () {
        var actual;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, completer.complete('console.l')];
                case 1:
                    actual = _a.sent();
                    assert.deepEqual(actual, {
                        completions: ['og'],
                        originalSubstring: 'l',
                        fillable: true,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, mocha_1.it)('console.log|', function () { return __awaiter(void 0, void 0, void 0, function () {
        var actual;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, completer.complete('console.log')];
                case 1:
                    actual = _a.sent();
                    assert.deepEqual(actual, {
                        completions: [],
                        originalSubstring: 'log',
                        fillable: true,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, mocha_1.it)('global.console.lo|', function () { return __awaiter(void 0, void 0, void 0, function () {
        var actual;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, completer.complete('global.console.lo')];
                case 1:
                    actual = _a.sent();
                    assert.deepStrictEqual(actual, {
                        completions: ['g'],
                        fillable: true,
                        originalSubstring: 'lo',
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, mocha_1.it)('console.|log', function () { return __awaiter(void 0, void 0, void 0, function () {
        var completions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, completer.complete('console.log', 8)];
                case 1:
                    completions = (_a.sent()).completions;
                    ['log', 'dir', 'warn', '__proto__']
                        .forEach(function (prop) { return assert.ok(completions.includes(prop), "should include ".concat(prop)); });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, mocha_1.it)('con|sole.log', function () { return __awaiter(void 0, void 0, void 0, function () {
        var actual;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, completer.complete('con')];
                case 1:
                    actual = _a.sent();
                    assert.deepEqual(actual, {
                        completions: ['text', 'sole', 'structor'],
                        originalSubstring: 'con',
                        fillable: true,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    // eslint-disable-next-line func-names
    (0, mocha_1.it)('console.log(|', function () {
        return __awaiter(this, void 0, void 0, function () {
            var actual;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (windows) {
                            // FIXME: should work
                            this.skip();
                        }
                        return [4 /*yield*/, completer.complete('console.log(')];
                    case 1:
                        actual = _a.sent();
                        assert.deepStrictEqual(actual, {
                            completions: ['...data'],
                            fillable: false,
                        });
                        return [2 /*return*/];
                }
            });
        });
    });
    // eslint-disable-next-line func-names
    (0, mocha_1.it)('new Number(|', function () {
        return __awaiter(this, void 0, void 0, function () {
            var actual;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (windows) {
                            // FIXME: should work
                            this.skip();
                        }
                        return [4 /*yield*/, completer.complete('new Number(')];
                    case 1:
                        actual = _a.sent();
                        assert.deepStrictEqual(actual, {
                            completions: ['?value'],
                            fillable: false,
                        });
                        return [2 /*return*/];
                }
            });
        });
    });
    (0, mocha_1.it)('console.log()', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, completer.complete('console.log()')];
                case 1:
                    res = _a.sent();
                    assert.equal(res, undefined);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, mocha_1.it)('console.log("di|")', function () { return __awaiter(void 0, void 0, void 0, function () {
        var actual;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, completer.complete('console.log("di")', 15)];
                case 1:
                    actual = _a.sent();
                    assert.deepStrictEqual(actual, {
                        completions: ['re1', 're2'],
                        originalSubstring: 'di',
                        fillable: true,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
