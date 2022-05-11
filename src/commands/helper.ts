// removes from a string the debugger node message
export function cleanDebuggerOutput(str = ''): string {
  return (str.startsWith('Debugger listening on ws://') && str.endsWith('Waiting for the debugger to disconnect...\n'))
    ? str.split(/\r?\n/).slice(3, -2).join('\n')
    : str;
}


// removes from a string the log npm can produce. Does not handle ANSI color.
// --silent does not always works, see https://github.com/npm/cli/issues/4877
// https://docs.npmjs.com/cli/v8/using-npm/logging
export function cleanNpmLog(str = ''): string {
  return str
    .split(/\r?\n/)
    .filter((line) => !/^npm (info|notice|verb|timing|http|sill|ERR|WARN)/.test(line))
    .join('\n');
}
