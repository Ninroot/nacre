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
require('../global');
var inspector = require("inspector");
var path = require("path");
var Inspector = /** @class */ (function () {
    function Inspector() {
        this.session = new inspector.Session();
        this.remoteGlobal = null;
    }
    Inspector.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.session.connect();
                        this.session.post('Runtime.enable'); // FIXME needed?
                        _a = this;
                        return [4 /*yield*/, this.getRemoteGlobal()];
                    case 1:
                        _a.remoteGlobal = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Inspector.prototype.stop = function () {
        this.session.disconnect();
    };
    Inspector.prototype.post = function (method, params) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.session.post(method, params, function (err, res) {
                if (err) {
                    return reject(err);
                }
                return resolve(res);
            });
        });
    };
    Inspector.prototype.getRemoteGlobal = function () {
        return this.post('Runtime.evaluate', {
            expression: 'globalThis',
        })
            .then(function (value) { return value.result; });
    };
    Inspector.prototype.getGlobalNames = function () {
        return Promise.all([
            this.post('Runtime.globalLexicalScopeNames', undefined)
                .then(function (r) { return r.names; }),
            this.post('Runtime.getProperties', {
                objectId: this.remoteGlobal.objectId,
            })
                .then(function (r) { return r.result.map(function (p) { return p.name; }); }),
        ])
            .then(function (r) { return r.flat(); });
    };
    Inspector.prototype.loadModule = function (moduleAbsPath) {
        var moduleName = path.basename(moduleAbsPath);
        var f = "function load(moduleName) {\n      try {\n        const m = require('".concat(moduleAbsPath, "');\n        if (m) {\n          globalThis[moduleName] = m;\n        }\n      } catch (e) { }\n    }");
        return this.callFunctionOn(f, [{ value: moduleName }]);
    };
    Inspector.prototype.evaluate = function (source, throwOnSideEffect) {
        var wrapped = /^\s*{/.test(source) && !/;\s*$/.test(source)
            ? "(".concat(source, ")")
            : source;
        return this.post('Runtime.evaluate', {
            expression: wrapped,
            throwOnSideEffect: throwOnSideEffect,
            contextId: 1,
            replMode: true,
            timeout: throwOnSideEffect ? 200 : undefined,
            objectGroup: 'OBJECT_GROUP',
        });
    };
    Inspector.prototype.execute = function (line) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, result, exceptionDetails, uncaught, inspected;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.evaluate(line, false)];
                    case 1:
                        _a = _b.sent(), result = _a.result, exceptionDetails = _a.exceptionDetails;
                        uncaught = !!exceptionDetails;
                        return [4 /*yield*/, this.callFunctionOn("function inspect(v) {\n        return util.inspect(v, {\n          depth: Infinity,\n          colors: false,\n          showProxy: true,\n          maxArrayLength: Infinity,\n        });\n      }", [result])];
                    case 2:
                        inspected = (_b.sent()).result;
                        return [2 /*return*/, "".concat(uncaught ? 'Uncaught ' : '').concat(inspected.value)];
                }
            });
        });
    };
    Inspector.prototype.callFunctionOn = function (f, args) {
        return this.post('Runtime.callFunctionOn', {
            executionContextId: 1,
            functionDeclaration: f,
            arguments: args,
            objectGroup: 'OBJECT_GROUP',
        });
    };
    Inspector.prototype.preview = function (line) {
        var _this = this;
        return this.evaluate(line, true)
            .then(function (_a) {
            var result = _a.result, exceptionDetails = _a.exceptionDetails;
            if (exceptionDetails) {
                throw new Error();
            }
            return _this.callFunctionOn("function inspect(v) {\n          const i = util.inspect(v, {\n            colors: false,\n            breakLength: Infinity,\n            compact: true,\n            maxArrayLength: 10,\n            depth: 1,\n          });\n          return i.split('\\n')[0].trim();\n        }", [result]);
        })
            .then(function (_a) {
            var result = _a.result;
            return result.value;
        })
            .catch(function () { return undefined; });
    };
    return Inspector;
}());
exports.default = Inspector;
