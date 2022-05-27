'use strict';

import acorn = require('acorn-loose');
import walk = require('acorn-walk');
import path = require('./path');
import Inspector from './inspector';
import { Completion, itemPathCompleter } from './pathCompleter';

type Context = {
  completion?: Completion;
  signature?: string;
};

export default class Completer {
  private runner: Inspector;

  constructor(runner) {
    this.runner = runner;
  }

  async complete(source, cursor?: number): Promise<Context | undefined> {
    if (!source) {
      const globalNames = await this.runner.getGlobalNames();
      return { completion: [globalNames, ''] };
    }
    // cursor can be at position 0
    if (cursor === undefined || cursor === null) {
      cursor = source.length;
    }

    const root = acorn.parse(source, { ecmaVersion: 2020 });
    // Acorn does not define all Node properties in the d.ts
    // https://github.com/acornjs/acorn/issues/741
    const node: any = walk.findNodeAround(root, cursor).node;

    if (!node) {
      return undefined;
    }

    if (node.type === 'Literal' && typeof node.value === 'string') {
      if (cursor === node.start || (cursor === node.end && this.isCompletedString(node.raw))) {
        return undefined;
      }

      const pathToComplete = node.value.slice(0, cursor - 1);

      const callExpression = this.findParent(root, this.findParent(root, node));
      if (callExpression && callExpression.type === 'CallExpression') {
        const callArguments = callExpression.arguments;
        const argAtCursor = callArguments.find((arg) => arg.start <= cursor && cursor <= arg.end);
        const argNumber = callExpression.arguments.indexOf(argAtCursor);
        if (argAtCursor && argAtCursor.type === 'Literal') {
          const callee = source.slice(callExpression.callee.start, callExpression.callee.end);
          const completeFunction = `function f(str, argNumber) { return JSON.stringify(${callee}.complete[argNumber](str)) }`;
          const funRes = await this.runner.callFunctionOn(completeFunction, [{ value: pathToComplete }, { value: argNumber }]);
          if (funRes.result && funRes.result.subtype !== 'error') {
            const jsonRes = JSON.parse(funRes.result.value);
            return { completion: jsonRes };
          }
        }
      }
      return { completion: itemPathCompleter(pathToComplete) };
    }
    if (node.type === 'Identifier') {
      const identifierName = node.name.slice(0, cursor);
      await this.loadModule(node.name);
      const matchingIdentifier = await this.completeIdentifier(identifierName);
      if (matchingIdentifier.length > 0) {
        return { completion: [matchingIdentifier, identifierName] };
      }
    }
    if (node.type === 'MemberExpression' && !node.computed) {
      const { property } = node;
      const matchingProperties = await this.completeProperties(node, source, cursor);
      const propName = (cursor === property.start || property.name === '✖') ? '' : property.name;
      return { completion: [matchingProperties, propName] };
    }
    if (node.type === 'CallExpression' || node.type === 'NewExpression') {
      if (source[node.end - 1] !== ')') {
        const matchingFunctions = await this.completeFunction(source, node);
        if (matchingFunctions) {
          return { signature: matchingFunctions };
        }
      }
    }

    return undefined;
  }

  /**
   * Recursively traverse the rootObject to find the parent of childObject.
   * @param rootObject - root object to inspect
   * @param childObject - child object to match
   * @returns - parent object of child if exists, undefined otherwise
   */
  findParent(rootObject, childObject) {
    if (!(rootObject && typeof rootObject === 'object')) {
      return undefined;
    }
    if (Array.isArray(rootObject)) {
      for (let i = 0; i < rootObject.length; i++) {
        if (rootObject[i] === childObject) {
          return rootObject;
        }
        const child = this.findParent(rootObject[i], childObject);
        if (child) {
          return child;
        }
      }
    } else {
      const keys = Object.keys(rootObject);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        if (rootObject[key] === childObject) {
          return rootObject;
        }
        const child = this.findParent(rootObject[key], childObject);
        if (child) {
          return child;
        }
      }
    }
    return undefined;
  }

  isCompletedString(string) {
    if (!string || string.length < 2) {
      return false;
    }
    const start = string[0];
    const end = string.slice(-1)[0];
    return ['\'', '"', '`'].includes(start) && start === end;
  }

  removePrefix(array, prefix) {
    return array.filter((e) => e.startsWith(prefix))
      .map((withPrefix) => withPrefix.slice(prefix.length))
      .filter((withoutPrefix) => withoutPrefix !== '');
  }

  async completeIdentifier(id) {
    const globalIds = await this.getGlobalIdentifiers();
    return globalIds.filter((gid) => gid.startsWith(id));
  }

  getGlobalIdentifiers() {
    return this.runner.getGlobalNames();
  }

  async loadModule(moduleName) {
    const { result: localModule } = await this.runner.loadModule(moduleName);
    return localModule.type === 'object';
  }

  async completeProperties(node, source, cursor) {
    const properties = await this.getProperties(node, source);
    const { property } = node;
    const relativeCursor = cursor - property.start;
    let propertyName = property.name === '✖' ? '' : property.name;
    propertyName = propertyName.slice(0, relativeCursor);
    return properties.filter((p) => p.startsWith(propertyName));
  }

  async getProperties(node, source) {
    const { object } = node;
    const expression = source.slice(object.start, object.end);
    const evaluated = await this.runner.evaluate(expression, true);
    if (evaluated.exceptionDetails) {
      return [];
    }
    const properties = (await this.runner.post('Runtime.getProperties', {
      objectId: evaluated.result.objectId,
      generatePreview: true,
    })).result;
    return properties.map((p) => p.name);
  }

  async completeFunction(line, expression): Promise<string | undefined> {
    const callee = line.slice(expression.callee.start, expression.callee.end);
    const {
      result,
      exceptionDetails,
    } = await this.runner.evaluate(callee, true);
    if (exceptionDetails) {
      return undefined;
    }
    const { result: annotation } = await this.runner.callFunctionOn(
      `function complete(fn, expression, line) {
        const { completeCall } = require('${require.resolve('../annotations')}');
        const a = completeCall(fn, expression, line);
        return a;
      }`,
      [result, { value: expression }, { value: line }],
    );
    if (annotation.type === 'string') {
      return annotation.value as string;
    }
    return undefined;
  }
}
