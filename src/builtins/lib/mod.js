'use strict';

exports.add = (src, dst) => src | dst;

exports.remove = (src, dst) => {
  const mask = 0o7777777;
  return src & (mask ^ dst);
};
