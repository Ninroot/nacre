'use strict';

export default class CommandFailedError extends Error {
  private status: string;

  private signal: string;

  private stdout: string;

  private stderr: string;

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
