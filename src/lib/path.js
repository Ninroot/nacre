'use strict';
// eslint-disable-next-line @typescript-eslint/no-var-requires
var path = require('path');
path.normalizeCurrent = function (itemPath) {
    if (itemPath === '' || itemPath === './') {
        return '';
    }
    return path.normalize(itemPath);
};
module.exports = path;
