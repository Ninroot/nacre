'use strict';

import { execSync } from 'child_process';
import CommandFailedError from './lib/errors';
import {platform} from "process";

const sh = (command?: string) => {
  if (!command) {
    return undefined;
  }
  try {
    const res = execSync(command);
    return res.toString();
  } catch (e) {
    if (e.stack.startsWith('Error: Command failed')) {
      throw new CommandFailedError(e);
    }
  }
};

export = (platform === 'win32') ? undefined : sh;
