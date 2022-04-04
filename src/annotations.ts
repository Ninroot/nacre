'use strict';

import fs = require('fs');
import path = require('path');
import Module = require('module');
import acorn = require('acorn');
import annotationMap = require('./annotation_map.js');

export function generateAnnotationForJsFunction(method) {
  const description = method.toString();
  if (description.includes('{ [native function] }')) {
    return false;
  }
  let expr = null;
  try {
    // any: acorn does not have all types defined
    // Try to parse as a function, anonymous function, or arrow function.
    const parsed: any = acorn.parse(`(${description})`, { ecmaVersion: 2020 });
    expr = parsed.body[0].expression;
  } catch {
    try {
      // Try to parse as a method.
      const parsed: any = acorn.parse(`({${description}})`, { ecmaVersion: 2020 });
      expr = parsed.body[0].expression;
    } catch {} // eslint-disable-line no-empty
  }
  if (!expr) {
    return false;
  }
  let params;
  switch (expr.type) {
    case 'ClassExpression': {
      if (!expr.body.body) {
        break;
      }
      const constructor = expr.body.body.find((m) => m.kind === 'constructor');
      if (constructor) {
        ({ params } = constructor.value);
      }
      break;
    }
    case 'ObjectExpression':
      if (!expr.properties[0] || !expr.properties[0].value) {
        break;
      }
      ({ params } = expr.properties[0].value);
      break;
    case 'FunctionExpression':
    case 'ArrowFunctionExpression':
      ({ params } = expr);
      break;
    default:
      break;
  }
  if (!params) {
    return false;
  }
  params = params.map(function paramName(param) {
    switch (param.type) {
      case 'Identifier':
        return param.name;
      case 'AssignmentPattern':
        return `?${paramName(param.left)}`;
      case 'ObjectPattern': {
        const list = param.properties.map((p) => {
          const k = paramName(p.key);
          const v = paramName(p.value);
          if (k === v) {
            return k;
          }
          if (`?${k}` === v) {
            return `?${k}`;
          }
          return `${k}: ${v}`;
        }).join(', ');
        return `{ ${list} }`;
      }
      case 'ArrayPattern': {
        const list = param.elements.map(paramName).join(', ');
        return `[ ${list} ]`;
      }
      case 'RestElement':
        return `...${paramName(param.argument)}`;
      default:
        return '?';
    }
  });
  annotationMap.set(method, { call: [params], construct: [params] });
  return true;
}

function gracefulOperation(fn, args, alternative) {
  try {
    return fn(...args);
  } catch {
    return alternative;
  }
}

export function completeCall(method, expression, buffer) {
  if (method === globalThis.require) {
    if (expression.arguments.length > 1) {
      return ')';
    }
    if (expression.arguments.length === 1) {
      const a = expression.arguments[0];
      if (a.type !== 'Literal' || typeof a.value !== 'string'
          || /['"]$/.test(a.value)) {
        return undefined;
      }
    }

    const extensions = Object.keys(require.extensions);
    const indexes = extensions.map((extension) => `index${extension}`);
    indexes.push('package.json', 'index');
    const versionedFileNamesRe = /-\d+\.\d+/;

    const completeOn = expression.arguments[0].value;
    const subdir = /([\w@./-]+\/)?(?:[\w@./-]*)/m.exec(completeOn)[1] || '';
    let group = [];
    let paths = [];

    if (completeOn === '.') {
      group = ['./', '../'];
    } else if (completeOn === '..') {
      group = ['../'];
    } else if (/^\.\.?\//.test(completeOn)) {
      paths = [process.cwd()];
    } else {
      // TODO make it nicer?
      // globalPaths definition not present in Module(?)
      const {globalPaths} = Module as any;
      paths = module.paths.concat(globalPaths);
    }

    paths.forEach((dir) => {
      dir = path.resolve(dir, subdir);
      gracefulOperation(
        fs.readdirSync,
        [dir, { withFileTypes: true }],
        [],
      ).forEach((dirent) => {
        if (versionedFileNamesRe.test(dirent.name) || dirent.name === '.npm') {
          // Exclude versioned names that 'npm' installs.
          return;
        }
        const extension = path.extname(dirent.name);
        const base = dirent.name.slice(0, -extension.length);
        if (!dirent.isDirectory()) {
          if (extensions.includes(extension) && (!subdir || base !== 'index')) {
            group.push(`${subdir}${base}`);
          }
          return;
        }
        group.push(`${subdir}${dirent.name}/`);
        const absolute = path.resolve(dir, dirent.name);
        const subfiles = gracefulOperation(fs.readdirSync, [absolute], []);
        for (const subfile of subfiles) {
          if (indexes.includes(subfile)) {
            group.push(`${subdir}${dirent.name}`);
            break;
          }
        }
      });
    });

    for (const g of group) {
      if (g.startsWith(completeOn)) {
        return g.slice(completeOn.length);
      }
    }

    return undefined;
  }

  if (!annotationMap.has(method)) {
    if (!generateAnnotationForJsFunction(method)) {
      return undefined;
    }
  }

  const entry = annotationMap.get(method)[{
    CallExpression: 'call',
    NewExpression: 'construct',
  }[expression.type]].slice(0);
  const target = expression.arguments.length + (buffer.trim().endsWith(',') ? 1 : 0);
  let params = entry.find((p) => p.length >= target) || entry.at(-1);
  if (target >= params.length) {
    if (params[params.length - 1].startsWith('...')) {
      return `, ${params[params.length - 1]}`;
    }
    return ')';
  }
  params = params.slice(target).join(', ');
  if (target > 0) {
    if (buffer.trim().endsWith(',')) {
      const spaces = buffer.length - (buffer.lastIndexOf(',') + 1);
      if (spaces > 0) {
        return params;
      }
      return ` ${params}`;
    }
    return `, ${params}`;
  }
  return params;
}
