'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var CommandFailedError = /** @class */ (function (_super) {
    __extends(CommandFailedError, _super);
    function CommandFailedError(error) {
        var _this = _super.call(this) || this;
        _this.name = 'CommandFailedError';
        _this.message = error.message;
        _this.status = error.status;
        _this.signal = error.signal;
        _this.stdout = error.stdout.toString();
        _this.stderr = error.stderr.toString();
        return _this;
    }
    return CommandFailedError;
}(Error));
exports.default = CommandFailedError;
