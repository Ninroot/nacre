#!/usr/bin/env node

'use strict';

const {
  createInterface,
  clearScreenDown,
} = require('readline');
const chalk = require('chalk');
const { underlineIgnoreANSI } = require('./util');
const highlight = require('./highlight');
const getHistory = require('./history');
const { Completer } = require('./lib/completer');
const { Inspector } = require('./lib/inspector');

const PROMPT = '> ';

async function start() {
  const runner = new Inspector();
  await runner.start();

  const comp = new Completer(runner);

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: PROMPT,
    completer(line, cb) {
      comp.complete(line)
        .then((result) => {
          if (result && result.fillable && result.originalSubstring !== undefined) {
            cb(null, [(result.completions || [])
              .map((l) => result.originalSubstring + l), result.originalSubstring]);
          } else {
            cb(null, [[], line]);
          }
        })
        .catch(() => {
          cb(null, [[], line]);
        });
    },
    postprocessor(line) {
      return highlight(line);
    },
  });
  rl.pause();

  // if node doesn't support postprocessor, force _refreshLine
  if (rl.postprocessor === undefined) {
    rl._insertString = (c) => {
      const beg = rl.line.slice(0, rl.cursor);
      const end = rl.line.slice(rl.cursor, rl.line.length);
      rl.line = beg + c + end;
      rl.cursor += c.length;
      rl._refreshLine();
    };
  }

  const history = await getHistory();
  rl.history = history.history;

  let MODE = 'NORMAL';

  let nextCtrlCKills = false;
  rl.on('SIGINT', () => {
    if (MODE === 'REVERSE') {
      MODE = 'NORMAL';
      process.stdout.moveCursor(0, -1);
      process.stdout.cursorTo(0);
      rl._refreshLine();
    } else if (rl.line.length) {
      rl.line = '';
      rl.cursor = 0;
      rl._refreshLine();
    } else if (nextCtrlCKills) {
      process.exit();
    } else {
      nextCtrlCKills = true;
      process.stdout.write(`\n(To exit, press ^C again)\n${PROMPT}`);
    }
  });

  let completionCache;
  const ttyWrite = rl._ttyWrite.bind(rl);
  rl._ttyWrite = (d, key) => {
    // TODO temporary disable this
    // const pairs = {
    //   '(': ')',
    //   '[': ']',
    //   '{': '}',
    //   '"': '"',
    //   '\'': '\'',
    //   '`': '`',
    // };
    // if (Object.keys(pairs).includes(key.sequence)) {
    //   rl._insertString(key.sequence);
    //   const closing = pairs[key.sequence];
    //   rl._insertString(closing);
    //   rl.cursor -= 1;
    //   rl._refreshLine();
    //   return;
    // }

    if (!(key.ctrl && key.name === 'c')) {
      nextCtrlCKills = false;
    }

    if (key.ctrl && key.name === 'r' && MODE === 'NORMAL') {
      MODE = 'REVERSE';
      process.stdout.write('\n');
      rl._refreshLine();
      return;
    }

    if (key.name === 'return' && MODE === 'REVERSE') {
      MODE = 'NORMAL';
      const match = rl.history.find((h) => h.includes(rl.line));
      process.stdout.moveCursor(0, -1);
      process.stdout.cursorTo(0);
      process.stdout.clearScreenDown();
      rl.cursor = match.indexOf(rl.line) + rl.line.length;
      rl.line = match;
      rl._refreshLine();
      return;
    }

    ttyWrite(d, key);

    if (key.name === 'right' && rl.cursor === rl.line.length) {
      if (completionCache) {
        rl._insertString(completionCache);
      }
    }
  };

  const refreshLine = rl._refreshLine.bind(rl);
  rl._refreshLine = () => {
    completionCache = undefined;
    const inspectedLine = rl.line;

    if (MODE === 'REVERSE') {
      process.stdout.moveCursor(0, -1);
      process.stdout.cursorTo(PROMPT.length);
      clearScreenDown(process.stdout);
      let match;
      if (inspectedLine) {
        match = rl.history.find((h) => h.includes(inspectedLine));
      }
      if (match) {
        match = highlight(match);
        match = underlineIgnoreANSI(match, inspectedLine);
      }
      process.stdout.write(`${match || ''}\n(reverse-i-search): ${inspectedLine}`);
      process.stdout.cursorTo('(reverse-i-search): '.length + rl.cursor);
      return;
    }

    if (rl.postprocessor === undefined) {
      rl.line = highlight(inspectedLine);
    }
    refreshLine();
    rl.line = inspectedLine;

    if (inspectedLine !== '') {
      process.stdout.cursorTo(PROMPT.length + rl.line.length);
      clearScreenDown(process.stdout);
      process.stdout.cursorTo(PROMPT.length + rl.cursor);

      Promise.all([
        comp.complete(inspectedLine),
        runner.preview(inspectedLine),
      ])
        .then(([completion, preview]) => {
          if (rl.line !== inspectedLine) {
            return;
          }
          if (completion && completion.completions.length > 0) {
            if (completion.fillable) {
              ([completionCache] = completion.completions);
            }
            process.stdout.cursorTo(PROMPT.length + rl.line.length);
            process.stdout.write(chalk.grey(completion.completions[0]));
          }
          if (preview) {
            process.stdout.write(`\n${chalk.grey(preview.slice(0, process.stdout.columns - 1))}`);
            process.stdout.moveCursor(0, -1);
          }
          if (completion || preview) {
            process.stdout.cursorTo(PROMPT.length + rl.cursor);
          }
        })
        .catch(() => {
        });
    }
  };

  process.stdout.write(`Nacre Alpha (Node.js ${process.versions.node} - V8 ${process.versions.v8})`);

  rl.resume();
  rl.prompt();
  for await (const line of rl) {
    rl.pause();
    clearScreenDown(process.stdout);

    const {
      result,
      exceptionDetails,
    } = await runner.evaluate(line, false);
    const uncaught = !!exceptionDetails;

    const { result: inspected } = await runner.callFunctionOn(
      `function inspect(v) {
        globalThis.${uncaught ? '_err' : '_'} = v;
        return util.inspect(v, {
          depth: 3,
          colors: true,
          showProxy: true,
          maxArrayLength: Infinity,
        });
      }`,
      [result],
    );

    process.stdout.write(`${uncaught ? 'Uncaught ' : ''}${inspected.value}\n`);

    await Promise.all([
      runner.post('Runtime.releaseObjectGroup', {
        objectGroup: 'OBJECT_GROUP',
      }),
      history.writeHistory(rl.history),
    ]);

    rl.resume();
    rl.prompt();
  }
}

start();
