'use strict';

// userid is not available for windows
import { chownSync, lstatSync } from 'fs';
import userid = require('./lib/userid');
import stat = require('./stat');
import {platform} from "process";

const chown: any = (itemPath) => {
  const ns = lstatSync(itemPath);
  return {
    owner: userid.username(ns.uid),
    group: userid.groupname(ns.gid),
  };
};

chown.get = (itemPath) => chown(itemPath);

chown.set = (itemPath, username, groupname) => {
  chownSync(itemPath, userid.uid(username), userid.gid(groupname));
  return {
    owner: username,
    group: groupname,
  };
};

chown.set.owner = (itemPath, username) => {
  const { group } = stat(itemPath);
  return chown.set(itemPath, username, group);
};

chown.set.group = (itemPath, groupname) => {
  const { owner } = stat(itemPath);
  return chown.set(itemPath, owner, groupname);
};

export = (platform === 'win32') ? undefined : chown;
