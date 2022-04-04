'use strict';

import {chmodSync, statSync} from "fs";
import {add, remove} from './mod';

export function getPerm(octal) {
  const getPermByBit = (bit) => {
    switch (bit) {
      case '0': return { read: false, write: false, execute: false };
      case '1': return { read: false, write: false, execute: true };
      case '2': return { read: false, write: true, execute: false };
      case '3': return { read: false, write: true, execute: true };
      case '4': return { read: true, write: false, execute: false };
      case '5': return { read: true, write: false, execute: true };
      case '6': return { read: true, write: true, execute: false };
      case '7': return { read: true, write: true, execute: true };
      default: return {};
    }
  };
  return {
    user: getPermByBit(octal.slice(-3, -2)),
    group: getPermByBit(octal.slice(-2, -1)),
    others: getPermByBit(octal.slice(-1)),
  };
}

export function modeToOctal(mode) {
  if (mode === null || mode === undefined) {
    return undefined;
  }
  let octal = 0o000;
  if (mode.user) {
    if (mode.user.execute) {
      octal = add(octal, 0o100);
    }
    if (mode.user.write) {
      octal = add(octal, 0o202);
    }
    if (mode.user.read) {
      octal = add(octal, 0o400);
    }
  }
  if (mode.group) {
    if (mode.group.execute) {
      octal = add(octal, 0o010);
    }
    if (mode.group.write) {
      octal = add(octal, 0o020);
    }
    if (mode.group.read) {
      octal = add(octal, 0o040);
    }
  }
  if (mode.others) {
    if (mode.others.execute) {
      octal = add(octal, 0o001);
    }
    if (mode.others.write) {
      octal = add(octal, 0o002);
    }
    if (mode.others.read) {
      octal = add(octal, 0o004);
    }
  }
  return octal;
}

export function addPerm(itemPath, mode) {
  const newMode = add(statSync(itemPath).mode, mode);
  chmodSync(itemPath, newMode);
  return getPerm(newMode.toString(8));
}

export function removePerm(itemPath, mode) {
  const newMode = remove(statSync(itemPath).mode, mode);
  chmodSync(itemPath, newMode);
  return getPerm(newMode.toString(8));
}

export function getMode(itemPath) {
  const octalPerm = statSync(itemPath).mode.toString(8);
  return getPerm(octalPerm);
}

export function setMode(itemPath, mode) {
  chmodSync(itemPath, mode);
  return getPerm(mode.toString(8));
}
