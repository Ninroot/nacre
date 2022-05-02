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

export default class Repl {
  private readonly input: any;

  private readonly output: any;

  private readonly prompt: any;

  private readonly rl;

  private readonly inspector: Inspector;

  private nextCtrlCKills: boolean;

  private mode: string;

  private completionCache: undefined;

  private completer: Completer;

  private history: any;

  private refreshLineParent: any;

  private ttyWriteParent: any;

  constructor(input, output, prompt) {
    this.input = input;
    this.output = output;
    this.prompt = prompt;
    this.rl = readline.createInterface({
      input: this.input,
      output: this.output,
      prompt: this.prompt,
      completer: (line, cb) => this.completeCallback(line, cb),
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
    this.output.cursorTo(prevCursorPos.cols);
  }

  refreshLine() {
    this.completionCache = undefined;
    const inspectedLine = this.rl.line;

    if (this.mode === 'REVERSE') {
      this.output.moveCursor(0, -1);
      this.output.cursorTo(this.prompt.length);
      this.output.clearScreenDown();
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

    this.highlight(inspectedLine);

    if (inspectedLine !== '') {
      this.output.cursorTo(this.prompt.length + this.rl.line.length);
      this.output.clearScreenDown();
      this.output.cursorTo(this.prompt.length + this.rl.cursor);

      Promise.all([
        this.completer.complete(inspectedLine),
        this.inspector.preview(inspectedLine),
      ])
        .then(([context, preview]) => {
          if (this.rl.line !== inspectedLine) {
            return;
          }
          if (context && context.signature) {
            this.output.cursorTo(this.prompt.length + this.rl.line.length);
            this.output.write(chalk.grey(context.signature));
          }
          if (preview) {
            this.output.write(`\n${chalk.grey(preview.slice(0, this.output.columns - 1))}`);
            this.output.moveCursor(0, -1);
          }
          if (context || preview) {
            this.output.cursorTo(this.prompt.length + this.rl.cursor);
          }
        })
        .catch(() => {});
    }
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

    if (key.ctrl && key.name === 'r' && this.mode === 'NORMAL') {
      this.mode = 'REVERSE';
      this.output.write('\n');
      return false;
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
      this.output.clearScreenDown();
      await this.exec(line);
      this.rl.prompt();
    }
  }
}
