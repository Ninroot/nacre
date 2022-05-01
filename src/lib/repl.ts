#!/usr/bin/env node

'use strict';

import * as readline from 'node:readline';
import chalk = require('chalk');

import getHistory = require('../history');
import Completer from './completer';
import Inspector from './inspector';
import highlight = require('../highlight');
import { underlineIgnoreANSI } from '../util';
import { Completion } from './pathCompleter';

const pairs = {
  '(': ')',
  '[': ']',
  '{': '}',
  '"': '"',
  '\'': '\'',
  '`': '`',
};

// Note: clearLine and cursorTo are undefined when process.stdout is not a tty.
// Node/NPM console in WebStorm is non-Tty, as node process is started with input/output streams redirection.

export default class Repl {
  private readonly input: any;

  private readonly output: any;

  private readonly prompt: any;

  readonly rl;

  private readonly inspector: Inspector;

  private nextCtrlCKills: boolean;

  private mode: string;

  private completionCache: undefined;

  private completer: Completer;

  private history: any;

  private refreshLineParent: any;

  private ttyWriteParent: any;

  constructor(input, output, prompt, terminal = true) {
    this.input = input;
    this.output = output;
    this.prompt = prompt;
    this.rl = readline.createInterface({
      input: this.input,
      output: this.output,
      prompt: this.prompt,
      completer: (line, cb) => this.completeCallback(line, cb),
      terminal,
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
  }

  highlight(line: string) {
    const prevCursorPos = this.rl.getCursorPos();
    // highlight line "console" => "[36mconsole[39m"
    this.rl.line = highlight(line);
    // refresh to display the line highlighted
    this.refreshLineParent();
    // reset internal line without highlight
    this.rl.line = line;
    readline.cursorTo(this.output, prevCursorPos.cols);
  }

  refreshLine() {
    this.completionCache = undefined;
    const inspectedLine = this.rl.line;

    if (this.mode === 'REVERSE') {
      readline.moveCursor(this.output, 0, -1);
      readline.cursorTo(this.output, this.prompt.length);
      readline.clearScreenDown(this.output);
      let match;
      if (inspectedLine) {
        match = this.rl.history.find((h) => h.includes(inspectedLine));
      }
      if (match) {
        match = highlight(match);
        match = underlineIgnoreANSI(match, inspectedLine);
      }
      this.output.write(`${match || ''}\n(reverse-i-search): ${inspectedLine}`);
      readline.cursorTo(this.output, '(reverse-i-search): '.length + this.rl.cursor);
      return;
    }

    this.highlight(inspectedLine);

    if (inspectedLine !== '') {
      readline.cursorTo(this.output, this.prompt.length + this.rl.line.length);
      readline.clearScreenDown(this.output);
      readline.cursorTo(this.output, this.prompt.length + this.rl.cursor);

      Promise.all([
        this.completer.complete(inspectedLine),
        this.inspector.preview(inspectedLine),
      ])
        .then(([context, preview]) => {
          if (this.rl.line !== inspectedLine) {
            return;
          }
          if (context && context.signature) {
            readline.cursorTo(this.output, this.prompt.length + this.rl.line.length);
            this.output.write(chalk.grey(context.signature));
          }
          if (preview) {
            this.output.write(`\n${chalk.grey(preview.slice(0, this.output.columns - 1))}`);
            readline.moveCursor(this.output, 0, -1);
          }
          if (context || preview) {
            readline.cursorTo(this.output, this.prompt.length + this.rl.cursor);
          }
        })
        .catch(() => {});
    }
  }

  previousChar() {
    return this.rl.line[this.rl.cursor - 1];
  }

  nextChar() {
    return this.rl.line[this.rl.cursor];
  }

  ttyWrite(char, key) {
    const writeKeystroke = this.handleKeystroke(char, key);
    if (writeKeystroke) {
      this.ttyWriteParent(char, key);
    }
    if (key.name !== 'return') {
      this.refreshLine();
    }
  }

  /**
   * @return true if char must be written
   */
  handleKeystroke(char, key): boolean {
    if (!(key.ctrl && key.name === 'c')) {
      this.nextCtrlCKills = false;
    }

    // typing `(` when `(|)` => `((|))`
    if (Object.keys(pairs).includes(key.sequence) || Object.values(pairs).includes(key.sequence)) {
      const prev = this.previousChar();
      const next = this.nextChar();
      const curr = key.sequence;
      const according = pairs[curr];
      // typing `(` when `abc|)` => `abc(|)`
      if (prev !== curr && next === according && curr !== pairs[curr]) {
        return true;
      }
      // typing `)` when `abc|)` => `abc)|`
      if (Object.values(pairs).includes(key.sequence) && curr === next) {
        this.rl.cursor++;
        return false;
      }
      if (according) {
        this.insertString(key.sequence + according);
        this.rl.cursor--;
        return false;
      }
      return true;
    }

    if (key.name === 'backspace') {
      const prev = this.previousChar();
      const next = this.nextChar();
      if (Object.keys(pairs).includes(prev) && pairs[prev] === next) {
        this.removeString(this.rl.cursor, this.rl.cursor + 1);
      }
      return true;
    }

    if (key.ctrl && key.name === 'r' && this.mode === 'NORMAL') {
      this.mode = 'REVERSE';
      this.output.write('\n');
      return false;
    }

    if (key.name === 'return' && this.mode === 'REVERSE') {
      this.mode = 'NORMAL';
      const match = this.rl.history.find((h) => h.includes(this.rl.line));
      readline.moveCursor(this.output, 0, -1);
      readline.cursorTo(this.output, 0);
      readline.clearScreenDown(this.output);
      this.rl.cursor = match.indexOf(this.rl.line) + this.rl.line.length;
      this.rl.line = match;
      this.refreshLine();
      return false;
    }

    if (key.name === 'right' && this.rl.cursor === this.rl.line.length) {
      if (this.completionCache) {
        this.insertString(this.completionCache);
      }
      return false;
    }

    return true;
  }

  insertString(string) {
    const beg = this.rl.line.slice(0, this.rl.cursor);
    const end = this.rl.line.slice(this.rl.cursor, this.rl.line.length);
    this.rl.line = beg + string + end;
    this.rl.cursor += string.length;
  }

  removeString(beg, end) {
    const prefix = this.rl.line.slice(0, beg);
    const suffix = this.rl.line.slice(end);
    this.rl.line = prefix + suffix;
    this.rl.cursor = prefix.length;
    readline.cursorTo(this.output, prefix.length);
  }

  quit() {
    if (this.mode === 'REVERSE') {
      this.mode = 'NORMAL';
      readline.moveCursor(this.output, 0, -1);
      readline.cursorTo(this.output, 0);
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

  completeCallback(line, callback) {
    this.completePromise(line)
      .then((completion) => callback(null, completion))
      .catch(() => callback(null, [[], line]));
  }

  completePromise(line): Promise<Completion> {
    return this.completer
      .complete(line)
      .then((context) => context.completion);
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
    this.output.write('Welcome to Nacre version Beta. Find help at https://nacre.sh.\n');
    this.rl.prompt();
    for await (const line of this.rl) {
      this.rl.pause();
      readline.clearScreenDown(this.output);
      await this.exec(line);
      this.rl.prompt();
    }
  }
}
