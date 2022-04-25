'use strict';

// userid is not available for windows
import { chownSync, lstatSync } from 'fs';
import userid = require('./lib/userid');
import stat = require('./stat');

type Ownership = {
  user: string;
  group: string;
};


/**
 * Get the user and group ownership of the given file.
 * @param itemPath - path of the file.
 * @return - ownership of the file.
 */
const chown = (itemPath: string): Ownership => {
  const ns = lstatSync(itemPath);
  return {
    user: userid.username(ns.uid),
    group: userid.groupname(ns.gid),
  };
};

/**
 * Alias of chown.
 * @param itemPath - path of the file.
 * @return - ownership of the file.
 * @see chown
 */
chown.get = (itemPath: string): Ownership => chown(itemPath);

/**
 * Set the user and group ownership of the given file.
 * @param itemPath - path of the file.
 * @param username - username of the owner.
 * @param groupname - groupname of the owner.
 * @return - ownership of the file.
 */
chown.set = (itemPath: string, username: string, groupname: string): Ownership => {
  chownSync(itemPath, userid.uid(username), userid.gid(groupname));
  return {
    user: username,
    group: groupname,
  };
};

/**
 * Set the user ownership of the given file.
 * @param itemPath - path of the file.
 * @param username - username of the owner.
 * @return - ownership of the file.
 */
// @ts-ignore
chown.set.owner = (itemPath: string, username: string): Ownership => {
  const { group } = stat(itemPath);
  return chown.set(itemPath, username, group);
};

/**
 * Set the group ownership of the given file.
 * @param itemPath - path of the file.
 * @param groupname - groupname of the owner.
 * @return - ownership of the file.
 */
// @ts-ignore
chown.set.group = (itemPath: string, groupname: string): Ownership => {
  const { owner } = stat(itemPath);
  return chown.set(itemPath, owner, groupname);
};

export = chown;
