#!/usr/bin/env node

'use strict';

const {
  clearScreenDown,
  createInterface,
} = require('readline');
const chalk = require('chalk');
const getHistory = require('../history');
const { Completer } = require('./completer');
const { Inspector } = require('./inspector');
const highlight = require('../highlight');
const { underlineIgnoreANSI } = require('../util');

const pairs = {
  '(': ')',
  '[': ']',
  '{': '}',
  '"': '"',
  '\'': '\'',
  '`': '`',
};

const backspace = '\x7F';

class Repl {
  constructor(input, output, prompt) {
    this.input = input;
    this.output = output;
    this.prompt = prompt;
    this.rl = createInterface({
      input: this.input,
      output: this.output,
      prompt: this.prompt,
      completer: (line, cb) => this.complete(line, cb),
    });
    this.inspector = new Inspector();
    this.nextCtrlCKills = false;
    this.mode = 'NORMAL';
    this.completionCache = undefined;
  }

  async init() {
    await this.inspector.start();
    this.completer = new Completer(this.inspector);
    this.rl.on('SIGINT', () => this.quit());

    this.history = await getHistory();
    this.rl.history = this.history.history;

    this.refreshLineParent = this.rl._refreshLine.bind(this.rl);
    this.rl._refreshLine = () => this.refreshLine();

    this.ttyWriteParent = this.rl._ttyWrite.bind(this.rl);
    this.rl._ttyWrite = (seq, key) => this.ttyWrite(seq, key);

    this.rl._insertString = (string) => this.insertString(string);
  }

  refreshLine() {
    this.completionCache = undefined;
    const inspectedLine = this.rl.line;

    if (this.mode === 'REVERSE') {
      this.output.moveCursor(0, -1);
      this.output.cursorTo(this.prompt.length);
      clearScreenDown(this.output);
      let match;
      if (inspectedLine) {
        match = this.rl.history.find((h) => h.includes(inspectedLine));
      }
      if (match) {
        match = highlight(match);
        match = underlineIgnoreANSI(match, inspectedLine);
      }
      this.output.write(`${match || ''}\n(reverse-i-search): ${inspectedLine}`);
      this.output.cursorTo('(reverse-i-search): '.length + this.rl.cursor);
      return;
    }

    this.rl.line = highlight(inspectedLine);
    this.refreshLineParent();
    this.rl.line = inspectedLine;

    if (inspectedLine !== '') {
      this.output.cursorTo(this.prompt.length + this.rl.line.length);
      clearScreenDown(this.output);
      this.output.cursorTo(this.prompt.length + this.rl.cursor);

      Promise.all([
        this.completer.complete(inspectedLine),
        this.inspector.preview(inspectedLine),
      ])
        .then(([completion, preview]) => {
          if (this.rl.line !== inspectedLine) {
            return;
          }
          if (completion && completion.completions.length > 0) {
            if (completion.fillable) {
              ([this.completionCache] = completion.completions);
            }
            this.output.cursorTo(this.prompt.length + this.rl.line.length);
            this.output.write(chalk.grey(completion.completions[0]));
          }
          if (preview) {
            this.output.write(`\n${chalk.grey(preview.slice(0, this.output.columns - 1))}`);
            this.output.moveCursor(0, -1);
          }
          if (completion || preview) {
            this.output.cursorTo(this.prompt.length + this.rl.cursor);
          }
        })
        .catch(() => {
        });
    }
  }

  previousChar() {
    return this.rl.line[this.rl.cursor - 1];
  }

  nextChar() {
    return this.rl.line[this.rl.cursor];
  }

  ttyWrite(char, key) {
    if (!(key.ctrl && key.name === 'c')) {
      this.nextCtrlCKills = false;
    }

    if (Object.keys(pairs).includes(key.sequence)) {
      this.insertString(key.sequence);
      const prev = this.previousChar();
      const next = this.nextChar();
      const opening = key.sequence;
      const according = pairs[key.sequence];
      if ((prev === opening && next === according) || next !== according) {
        this.insertString(according);
        this.rl.cursor -= 1;
      }
      this.refreshLine();
      return;
    }

    if (char === backspace) {
      const prev = this.previousChar();
      const next = this.nextChar();
      if (Object.keys(pairs).includes(prev) && pairs[prev] === next) {
        this.removeString(this.rl.cursor - 1, this.rl.cursor + 1);
        return;
      }
    }

    if (key.ctrl && key.name === 'r' && this.mode === 'NORMAL') {
      this.mode = 'REVERSE';
      this.output.write('\n');
      this.refreshLine();
      return;
    }

    if (key.name === 'return' && this.mode === 'REVERSE') {
      this.mode = 'NORMAL';
      const match = this.rl.history.find((h) => h.includes(this.rl.line));
      this.output.moveCursor(0, -1);
      this.output.cursorTo(0);
      this.output.clearScreenDown();
      this.rl.cursor = match.indexOf(this.rl.line) + this.rl.line.length;
      this.rl.line = match;
      this.refreshLine();
      return;
    }

    this.ttyWriteParent(char, key);

    if (key.name === 'right' && this.rl.cursor === this.rl.line.length) {
      if (this.completionCache) {
        this.insertString(this.completionCache);
      }
    }
  }

  insertString(string) {
    const beg = this.rl.line.slice(0, this.rl.cursor);
    const end = this.rl.line.slice(this.rl.cursor, this.rl.line.length);
    this.rl.line = beg + string + end;
    this.rl.cursor += string.length;
    this.refreshLine();
  }

  removeString(beg, end) {
    const prefix = this.rl.line.slice(0, beg);
    const suffix = this.rl.line.slice(end);
    this.rl.line = prefix + suffix;
    this.rl.cursor = prefix.length;
    this.output.cursorTo(prefix.length);
    this.refreshLine();
  }

  quit() {
    if (this.mode === 'REVERSE') {
      this.mode = 'NORMAL';
      this.output.moveCursor(0, -1);
      this.output.cursorTo(0);
      this.refreshLine();
    } else if (this.rl.line.length) {
      this.rl.line = '';
      this.rl.cursor = 0;
      this.refreshLine();
    } else if (this.nextCtrlCKills) {
      process.exit();
    } else {
      this.nextCtrlCKills = true;
      this.output.write(`\n(To exit, press ctrl+c again)\n${this.prompt}`);
    }
  }

  complete(line, cb) {
    return this.completer.complete(line)
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
  }

  async exec(line) {
    const {
      result,
      exceptionDetails,
    } = await this.inspector.evaluate(line, false);
    const uncaught = !!exceptionDetails;

    const { result: inspected } = await this.inspector.callFunctionOn(
      `function inspect(v) {
        globalThis.${uncaught ? '_err' : '_'} = v;
        return util.inspect(v, {
          depth: 3,
          colors: true,
          showProxy: true,
          maxArrayLength: Infinity,
          maxStringLength: Infinity,
        });
      }`,
      [result],
    );

    this.output.write(`${uncaught ? 'Uncaught ' : ''}${inspected.value}\n`);

    await Promise.all([
      this.inspector.post('Runtime.releaseObjectGroup', {
        objectGroup: 'OBJECT_GROUP',
      }),
      this.history.writeHistory(this.rl.history),
    ]);
  }

  async start() {
    await this.init();
    this.output.write('Welcome to Nacre version Alpha. Find help at https://nacre.sh.\n');
    this.rl.prompt();
    for await (const line of this.rl) {
      this.rl.pause();
      clearScreenDown(this.output);
      await this.exec(line);
      this.rl.prompt();
    }
  }
}

module.exports = { Repl };
