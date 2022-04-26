'use strict';

import { execSync } from 'child_process';
import CommandFailedError from './lib/errors';

/**
 * Execute a given command.
 * @param command - command to be executed.
 * @return - The stdout from the execution.
 */
const $ = (command: string): string => {
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

export = $;
