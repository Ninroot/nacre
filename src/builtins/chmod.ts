'use strict';

import { addPerm, removePerm, getMode, setMode, modeToOctal, Perm } from './lib/_chmod';

// Declaration is done this way to build function object with properties in TypeScript
// https://stackoverflow.com/questions/12766528/build-a-function-object-with-properties-in-typescript

// ------------------------------ GET ------------------------------

/**
 * Get the permission of the given item.
 * @param itemPath - path of the item.
 * @return - permission of the item.
 */
const chmod = (itemPath: string): Perm => getMode(itemPath);


// ------------------------------ ADD ------------------------------


const chmodAdd = (itemPath: string): Perm => addPerm(itemPath, 0o777);
/**
 * Add read, write and execute permissions to user, group and others for the given item.
 * @param itemPath - path of the item.
 * @return - permission of the item.
 * @see chmod
 */
chmod.add = chmodAdd;

const chmodAddRead = (itemPath: string): Perm => addPerm(itemPath, 0o444);
/**
 * Add read permission to user, group and others for the given item.
 * @param itemPath - path of the item.
 * @return - permission of the item.
 * @see chmod
 */
chmodAdd.read = chmodAddRead;

const chmodAddReadUser = (itemPath: string): Perm => addPerm(itemPath, 0o400);
/**
 * Add read permission to user for the given item.
 * @param itemPath - path of the item.
 * @return - permission of the item.
 * @see chmod
 */
chmodAddRead.user = chmodAddReadUser;

const chmodAddReadGroup = (itemPath: string): Perm => addPerm(itemPath, 0o040);
/**
 * Add read permission to group for the given item.
 * @param itemPath - path of the item.
 * @return - permission of the item.
 * @see chmod
 */
chmodAddRead.group = chmodAddReadGroup;

const chmodAddReadOthers = (itemPath: string): Perm => addPerm(itemPath, 0o004);
/**
 * Add read permission to others for the given item.
 * @param itemPath - path of the item.
 * @return - permission of the item.
 * @see chmod
 */
chmodAddRead.others = chmodAddReadOthers;

const chmodAddWrite = (itemPath: string): Perm => addPerm(itemPath, 0o222);
/**
 * Add write permission to user, group and others for the given item.
 * @param itemPath - path of the item.
 * @return - permission of the item.
 * @see chmod
 */
chmodAdd.write = chmodAddWrite;

const chmodAddWriteUser = (itemPath: string): Perm => addPerm(itemPath, 0o200);
/**
 * Add write permission to user for the given item.
 * @param itemPath - path of the item.
 * @return - permission of the item.
 * @see chmod
 */
chmodAddWrite.user = chmodAddWriteUser;

const chmodAddWriteGroup = (itemPath: string): Perm => addPerm(itemPath, 0o020);
/**
 * Add write permission to group for the given item.
 * @param itemPath - path of the item.
 * @return - permission of the item.
 * @see chmod
 */
chmodAddWrite.group = chmodAddWriteGroup;

const chmodAddWriteOthers = (itemPath: string): Perm => addPerm(itemPath, 0o002);
/**
 * Add write permission to others for the given item.
 * @param itemPath - path of the item.
 * @return - permission of the item.
 * @see chmod
 */
chmodAddWrite.others = chmodAddWriteOthers;

const chmodAddExecute = (itemPath: string): Perm => addPerm(itemPath, 0o111);
/**
 * Add execute permission to user, group and others for the given item.
 * @param itemPath - path of the item.
 * @return - permission of the item.
 * @see chmod
 */
chmodAdd.execute = chmodAddExecute;

const chmodAddExecuteUser = (itemPath: string): Perm => addPerm(itemPath, 0o100);
/**
 * Add execute permission to user for the given item.
 * @param itemPath - path of the item.
 * @return - permission of the item.
 * @see chmod
 */
chmodAddExecute.user = chmodAddExecuteUser;

const chmodAddExecuteGroup = (itemPath: string): Perm => addPerm(itemPath, 0o010);
/**
 * Add execute permission group for the given item.
 * @param itemPath - path of the item.
 * @return - permission of the item.
 * @see chmod
 */
chmodAddExecute.group = chmodAddExecuteGroup;

const chmodAddExecuteOthers = (itemPath: string): Perm => addPerm(itemPath, 0o001);
/**
 * Add execute permission to others for the given item.
 * @param itemPath - path of the item.
 * @return - permission of the item.
 * @see chmod
 */
chmodAddExecute.others = chmodAddExecuteOthers;


// ------------------------------ REMOVE ------------------------------


const chmodRemove = (itemPath: string): Perm => removePerm(itemPath, 0o000);
/**
 * Remove read, write and execute permissions to user, group and others for the given item.
 * @param itemPath - path of the item.
 * @return - permission of the item.
 * @see chmod
 */
chmod.remove = chmodRemove;

const chmodRemoveRead = (itemPath: string): Perm => removePerm(itemPath, 0o444);
/**
 * Remove read permission to user, group and others for the given item.
 * @param itemPath - path of the item.
 * @return - permission of the item.
 * @see chmod
 */
chmodRemove.read = chmodRemoveRead;

const chmodRemoveReadUser = (itemPath: string): Perm => removePerm(itemPath, 0o400);
/**
 * Remove read permission to user for the given item.
 * @param itemPath - path of the item.
 * @return - permission of the item.
 * @see chmod
 */
chmodRemoveRead.user = chmodRemoveReadUser;

const chmodRemoveReadGroup = (itemPath: string): Perm => removePerm(itemPath, 0o040);
/**
 * Remove read permission to group for the given item.
 * @param itemPath - path of the item.
 * @return - permission of the item.
 * @see chmod
 */
chmodRemoveRead.group = chmodRemoveReadGroup;

const chmodRemoveReadOthers = (itemPath: string): Perm => removePerm(itemPath, 0o004);
/**
 * Remove read permission to others for the given item.
 * @param itemPath - path of the item.
 * @return - permission of the item.
 * @see chmod
 */
chmodRemoveRead.others = chmodRemoveReadOthers;

const chmodRemoveWrite = (itemPath: string): Perm => removePerm(itemPath, 0o222);
/**
 * Remove write permission to user, group and others for the given item.
 * @param itemPath - path of the item.
 * @return - permission of the item.
 * @see chmod
 */
chmodRemove.write = chmodRemoveWrite;

const chmodRemoveWriteUser = (itemPath: string): Perm => removePerm(itemPath, 0o200);
/**
 * Remove write permission to user for the given item.
 * @param itemPath - path of the item.
 * @return - permission of the item.
 * @see chmod
 */
chmodRemoveWrite.user = chmodRemoveWriteUser;

const chmodRemoveWriteGroup = (itemPath: string): Perm => removePerm(itemPath, 0o020);
/**
 * Remove write permission to group for the given item.
 * @param itemPath - path of the item.
 * @return - permission of the item.
 * @see chmod
 */
chmodRemoveWrite.group = chmodRemoveWriteGroup;

const chmodRemoveWriteOthers = (itemPath: string): Perm => removePerm(itemPath, 0o002);
/**
 * Remove write permission to others for the given item.
 * @param itemPath - path of the item.
 * @return - permission of the item.
 * @see chmod
 */
chmodRemoveWrite.others = chmodRemoveWriteOthers;

const chmodRemoveExecute = (itemPath: string): Perm => removePerm(itemPath, 0o111);
/**
 * Remove execute permission to user, group and others for the given item.
 * @param itemPath - path of the item.
 * @return - permission of the item.
 * @see chmod
 */
chmodRemove.execute = chmodRemoveExecute;

const chmodRemoveExecuteUser = (itemPath: string): Perm => removePerm(itemPath, 0o100);
/**
 * Remove execute permission to user for the given item.
 * @param itemPath - path of the item.
 * @return - permission of the item.
 * @see chmod
 */
chmodRemoveExecute.user = chmodRemoveExecuteUser;

const chmodRemoveExecuteGroup = (itemPath: string): Perm => removePerm(itemPath, 0o010);
/**
 * Remove execute permission group for the given item.
 * @param itemPath - path of the item.
 * @return - permission of the item.
 * @see chmod
 */
chmodRemoveExecute.group = chmodRemoveExecuteGroup;

const chmodRemoveExecuteOthers = (itemPath: string): Perm => removePerm(itemPath, 0o001);
/**
 * Remove execute permission to others for the given item.
 * @param itemPath - path of the item.
 * @return - permission of the item.
 * @see chmod
 */
chmodRemoveExecute.others = chmodRemoveExecuteOthers;


// ------------------------------ SET ------------------------------


const chmodSet = (itemPath: string, perm: Perm) => {
  if (perm === null || perm === undefined) {
    throw Error(`Expect perm to be defined. Actual: ${perm}`);
  }
  return setMode(itemPath, modeToOctal(perm));
};
/**
 * Set permissions for the given item.
 * @param itemPath - path of the item.
 * @param perm - permissions to set.
 * @return - permission of the item.
 */
chmod.set = chmodSet;

const chmodSetRead = (itemPath: string): Perm => setMode(itemPath, 0o444);
/**
 * Set read permission to user, group and others for the given item.
 * @param itemPath - path of the item.
 * @return - permission of the item.
 * @see chmod
 */
chmodSet.read = chmodSetRead;

const chmodSetReadUser = (itemPath: string): Perm => setMode(itemPath, 0o400);
/**
 * Set read permission to user for the given item.
 * @param itemPath - path of the item.
 * @return - permission of the item.
 * @see chmod
 */
chmodSetRead.user = chmodSetReadUser;

const chmodSetReadGroup = (itemPath: string): Perm => setMode(itemPath, 0o040);
/**
 * Set read permission to group for the given item.
 * @param itemPath - path of the item.
 * @return - permission of the item.
 * @see chmod
 */
chmodSetRead.group = chmodSetReadGroup;

const chmodSetReadOthers = (itemPath: string): Perm => setMode(itemPath, 0o004);
/**
 * Set read permission to others for the given item.
 * @param itemPath - path of the item.
 * @return - permission of the item.
 * @see chmod
 */
chmodSetRead.others = chmodSetReadOthers;

const chmodSetWrite = (itemPath: string): Perm => setMode(itemPath, 0o222);
/**
 * Set write permission to user, group and others for the given item.
 * @param itemPath - path of the item.
 * @return - permission of the item.
 * @see chmod
 */
chmodSet.write = chmodSetWrite;

const chmodSetWriteUser = (itemPath: string): Perm => setMode(itemPath, 0o200);
/**
 * Set write permission to user for the given item.
 * @param itemPath - path of the item.
 * @return - permission of the item.
 * @see chmod
 */
chmodSetWrite.user = chmodSetWriteUser;

const chmodSetWriteGroup = (itemPath: string): Perm => setMode(itemPath, 0o020);
/**
 * Set write permission to group for the given item.
 * @param itemPath - path of the item.
 * @return - permission of the item.
 * @see chmod
 */
chmodSetWrite.group = chmodSetWriteGroup;

const chmodSetWriteOthers = (itemPath: string): Perm => setMode(itemPath, 0o002);
/**
 * Set write permission to others for the given item.
 * @param itemPath - path of the item.
 * @return - permission of the item.
 * @see chmod
 */
chmodSetWrite.others = chmodSetWriteOthers;

const chmodSetExecute = (itemPath: string): Perm => setMode(itemPath, 0o111);
/**
 * Set execute permission to user, group and others for the given item.
 * @param itemPath - path of the item.
 * @return - permission of the item.
 * @see chmod
 */
chmodSet.execute = chmodSetExecute;

const chmodSetExecuteUser = (itemPath: string): Perm => setMode(itemPath, 0o100);
/**
 * Set execute permission to user for the given item.
 * @param itemPath - path of the item.
 * @return - permission of the item.
 * @see chmod
 */
chmodSetExecute.user = chmodSetExecuteUser;

const chmodSetExecuteGroup = (itemPath: string): Perm => setMode(itemPath, 0o010);
/**
 * Set execute permission group for the given item.
 * @param itemPath - path of the item.
 * @return - permission of the item.
 * @see chmod
 */
chmodSetExecute.group = chmodSetExecuteGroup;

const chmodSetExecuteOthers = (itemPath: string): Perm => setMode(itemPath, 0o001);
/**
 * Set execute permission to others for the given item.
 * @param itemPath - path of the item.
 * @return - permission of the item.
 * @see chmod
 */
chmodSetExecute.others = chmodSetExecuteOthers;


export = chmod;
