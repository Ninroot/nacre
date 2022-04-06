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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var mocha_1 = require("mocha");
var child_process_1 = require("child_process");
var assert = require("assert/strict");
var path = require("path");
var cwd;
(0, mocha_1.before)('save current working directory', function () {
    cwd = process.cwd();
});
(0, mocha_1.after)('restore current working directory', function () {
    process.chdir(cwd);
});
function run() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return new Promise(function (res) {
        var proc = (0, child_process_1.spawn)(process.execPath, __spreadArray([path.join(cwd, 'built', 'index.js')], args, true));
        var out = [];
        var err = [];
        proc.stdout.on('data', function (data) { return out.push(data); });
        proc.stderr.on('data', function (data) { return err.push(data); });
        proc.on('close', function (code, signal) {
            res({
                code: code,
                signal: signal,
                stdout: Buffer.concat(out)
                    .toString('utf8'),
                stderr: Buffer.concat(err)
                    .toString('utf8'),
            });
        });
    });
}
(0, mocha_1.describe)('index unit test', function () {
    (0, mocha_1.it)('--help', function () { return __awaiter(void 0, void 0, void 0, function () {
        var actual;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, run('--help')];
                case 1:
                    actual = _a.sent();
                    assert.ok(actual.stdout.includes('Usage'), "Should be ".concat(actual.stdout));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, mocha_1.it)('--evaluate 1+1', function () { return __awaiter(void 0, void 0, void 0, function () {
        var actual;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, run('--evaluate', '1+1')];
                case 1:
                    actual = _a.sent();
                    assert.ok(actual.stdout.includes('2'), "Should be ".concat(actual.stdout));
                    return [2 /*return*/];
            }
        });
    }); });
});
