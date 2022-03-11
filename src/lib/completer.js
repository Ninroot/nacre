'use strict';

const acorn = require('acorn-loose');
const walk = require('acorn-walk');
const path = require('path');
const fs = require('fs');

class Completer {
  constructor(runner) {
    this.runner = runner;
  }

  async complete(source, cursor) {
    if (!source) {
      return {
        completions: await this.runner.getGlobalNames(),
        originalSubstring: '',
        fillable: true,
      };
    }
    // cursor can be at position 0
    if (cursor === undefined || cursor === null) {
      cursor = source.length;
    }

    const root = acorn.parse(source, { ecmaVersion: 2020 });
    const { node } = walk.findNodeAround(root, cursor);

    if (!node) {
      return undefined;
    }

    if (node.type === 'Literal' && typeof node.value === 'string') {
      if (cursor === node.start || (cursor === node.end && this.isCompletedString(node.raw))) {
        return undefined;
      }
      const itemPath = cursor === node.start + 1 ? '' : node.value;
      const matchingPaths = this.completePath(itemPath);
      const trailingItempath = itemPath.slice(-1)[0] === '/' ? '' : path.basename(itemPath);
      return {
        completions: this.removePrefix(matchingPaths, itemPath),
        originalSubstring: trailingItempath,
        fillable: true,
      };
    }
    if (node.type === 'Identifier') {
      const identifierName = node.name.slice(0, cursor);
      await this.loadModule(node.name);
      const matchingIdentifier = await this.completeIdentifier(identifierName);
      return {
        completions: this.removePrefix(matchingIdentifier, identifierName),
        originalSubstring: identifierName,
        fillable: true,
      };
    }
    if (node.type === 'MemberExpression') {
      const {
        object,
        property,
      } = node;
      const globalIds = await this.getGlobalIdentifiers();
      if (globalIds.includes(object.name)) {
        const matchingProperties = await this.completeProperties(node, source, cursor);
        const propName = (cursor === property.start || property.name === '✖') ? '' : property.name;
        return {
          completions: this.removePrefix(matchingProperties, propName),
          originalSubstring: propName,
          fillable: true,
        };
      }
      return undefined;
    }
    if (node.type === 'CallExpression' || node.type === 'NewExpression') {
      if (source[node.end - 1] === ')') {
        return undefined;
      }
      const matchingFunctions = await this.completeFunction(source, node);
      return {
        completions: [matchingFunctions],
        fillable: false,
      };
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

  completePath(line) {
    const isDir = line.slice(-1) === '/';
    const dirname = isDir ? line : path.dirname(line);

    let items;
    try {
      items = fs.readdirSync(dirname);
    } catch {
      items = [];
    }

    const hits = items.filter((item) => {
      const baseItem = path.basename(item);
      const baseLine = path.basename(line);
      return baseItem.startsWith(baseLine);
    });

    if (line.length > 1 && !isDir) {
      items = [];
    }

    if (hits.length === 1) {
      const hit = path.join(dirname, hits[0]);
      if (fs.statSync(hit)
        .isDirectory()) {
        hits[0] = path.join(hits[0], '/');
      }
    }

    const completions = hits.length ? hits : items;
    return completions.map((e) => path.join(dirname, e));
  }

  async completeIdentifier(id) {
    const globalIds = await this.getGlobalIdentifiers();
    return globalIds.filter((gid) => gid.startsWith(id));
  }

  getGlobalIdentifiers() {
    return this.runner.getGlobalNames();
  }

  async loadModule(moduleName) {
    const { result } = await this.runner.loadModule(moduleName);
    return result.type === 'object';
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

  async completeFunction(line, expression) {
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
      return annotation.value;
    }
    return undefined;
  }
}

module.exports = { Completer };
