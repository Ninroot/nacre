'use strict';

export function add(src, dst) {
  return src | dst;
}

export function remove(src, dst){
  const mask = 0o7777777;
  return src & (mask ^ dst);
}
