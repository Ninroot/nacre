'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.add = void 0;
function add(src, dst) {
    return src | dst;
}
exports.add = add;
function remove(src, dst) {
    var mask = 2097151;
    return src & (mask ^ dst);
}
exports.remove = remove;
