'use strict';

require('../global');
const inspector = require('inspector');
const path = require('path');

class Inspector {
  constructor() {
    this.session = new inspector.Session();
    this.remoteGlobal = null;
  }

  async start() {
    this.session.connect();
    this.session.post('Runtime.enable'); // FIXME needed?
    this.remoteGlobal = await this.getRemoteGlobal();
  }

  stop() {
    this.session.disconnect();
  }

  post(method, params) {
    return new Promise((resolve, reject) => {
      this.session.post(method, params, (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });
    });
  }

  getRemoteGlobal() {
    return this.post('Runtime.evaluate', {
      expression: 'globalThis',
    })
      .then((value) => value.result);
  }

  getGlobalNames() {
    return Promise.all([
      this.post('Runtime.globalLexicalScopeNames')
        .then((r) => r.names),
      this.post('Runtime.getProperties', {
        objectId: this.remoteGlobal.objectId,
      })
        .then((r) => r.result.map((p) => p.name)),
    ])
      .then((r) => r.flat());
  }

  loadModule(moduleAbsPath) {
    const moduleName = path.basename(moduleAbsPath);
    console.log({moduleAbsPath});
    const f = `function load(moduleName) {
      try {
        globalThis[moduleName] = require('${moduleAbsPath}');
      } catch { }
    }`;
    return this.callFunctionOn(f, [{ value: moduleName }]);
  }

  evaluate(source, throwOnSideEffect) {
    const wrapped = /^\s*{/.test(source) && !/;\s*$/.test(source)
      ? `(${source})`
      : source;
    return this.post('Runtime.evaluate', {
      expression: wrapped,
      throwOnSideEffect,
      contextId: 1,
      replMode: true,
      timeout: throwOnSideEffect ? 200 : undefined,
      objectGroup: 'OBJECT_GROUP',
    });
  }

  async execute(line) {
    const {
      result,
      exceptionDetails,
    } = await this.evaluate(line, false);
    const uncaught = !!exceptionDetails;

    const { result: inspected } = await this.callFunctionOn(
      `function inspect(v) {
        return util.inspect(v, {
          depth: Infinity,
          colors: false,
          showProxy: true,
          maxArrayLength: Infinity,
        });
      }`,
      [result],
    );

    return `${uncaught ? 'Uncaught ' : ''}${inspected.value}`;
  }

  callFunctionOn(f, args) {
    return this.post('Runtime.callFunctionOn', {
      executionContextId: 1,
      functionDeclaration: f,
      arguments: args,
      objectGroup: 'OBJECT_GROUP',
    });
  }

  preview(line) {
    return this.evaluate(line, true)
      .then(({
        result,
        exceptionDetails,
      }) => {
        if (exceptionDetails) {
          throw new Error();
        }
        return this.callFunctionOn(
          `function inspect(v) {
          const i = util.inspect(v, {
            colors: false,
            breakLength: Infinity,
            compact: true,
            maxArrayLength: 10,
            depth: 1,
          });
          return i.split('\\n')[0].trim();
        }`,
          [result],
        );
      })
      .then(({ result }) => result.value)
      .catch(() => undefined);
  }
}

module.exports = { Inspector };
