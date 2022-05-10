'use strict';

import { describe, it } from 'mocha';

import { assert } from 'chai';
import { completeNpmPackageName, cleanDebuggerOutput, cleanNpmLog } from '../../../built/commands/helper';


describe('npm unit test', () => {

  it('should not change the string if no debugger', () => {
    assert.equal(cleanDebuggerOutput('hello world'), 'hello world');
  });

  it('removeDebuggerOutput without output', () => {
    const src = `Debugger listening on ws://127.0.0.1:54703/d3f8dc19-76bf-4119-8235-0dfd6f970d8a
For help, see: https://nodejs.org/en/docs/inspector
Debugger attached.
Waiting for the debugger to disconnect...
`;
    assert.equal(cleanDebuggerOutput(src), '');
  });

  it('removeDebuggerOutput with inner output', () => {
    const expect = `This is not part of the debugger.
This also.`;
    const src = `Debugger listening on ws://127.0.0.1:54703/d3f8dc19-76bf-4119-8235-0dfd6f970d8a
For help, see: https://nodejs.org/en/docs/inspector
Debugger attached.
${expect}
Waiting for the debugger to disconnect...
`;
    assert.equal(cleanDebuggerOutput(src), expect);
  });

  it('cleanNpmLog', () => {
    const str = `npm ERR! code E404
npm ERR! 404 tarball, folder, http url, or git url.
npm ERR! A complete log of this run can be found in:
npm WARN deprecated whatever: Version no longer supported. Upgrade to @latest
Expected
npm info using npm@8.6.0
npm info using node@v18.0.0
npm timing npm:load:whichnode Completed in 0ms
npm verb title npm install nacre@0.0.3
npm timing npm:load:setTitle Completed in 6ms
npm sill logfile start cleaning logs, removing 1 files
npm timing command:install Completed in 460ms
message

npm verb exit 0
npm timing npm Completed in 503ms
npm info ok `;
    assert.equal(cleanNpmLog(str), 'Expected\nmessage\n');
  });

  it('completeNpmPackageName', () => {
    // @ts-ignore
    const [hits, line] = completeNpmPackageName('chalk');
    assert.include(hits, 'chalk');
    assert.deepEqual(line, 'chalk');
  });

  it('completeNpmPackageName non existing package', () => {
    // @ts-ignore
    const [hits, line] = completeNpmPackageName('doesNotExist');
    assert.deepEqual(hits, []);
    assert.deepEqual(line, 'doesNotExist');
  });
});
