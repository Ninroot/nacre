'use strict';

// userid is not available for windows

const {
  lstatSync,
  chownSync,
} = require('fs');
const userid = require('userid');
const stat = require('./stat');

const chown = (itemPath) => {
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

module.exports = chown;
