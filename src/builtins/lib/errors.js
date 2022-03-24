'use strict';

class CommandFailedError extends Error {
  constructor(error) {
    super();
    this.name = 'CommandFailedError';
    this.message = error.message;
    this.status = error.status;
    this.signal = error.signal;
    this.stdout = error.stdout.toString();
    this.stderr = error.stderr.toString();
  }
}

module.exports = { CommandFailedError };
