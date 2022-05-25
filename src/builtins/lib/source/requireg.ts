// MIT License (MIT)
//
// Copyright 2013 Tomas Aparicio
// Copyright 2022 Arnaud Debec
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following
// conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.

import { resolvers } from "./resolvers";

export function resolve(module, dirname) {
  let i, l, resolver, modulePath;

  for (i = 0, l = resolvers.length; i < l; i += 1) {
    resolver = resolvers[i];
    if ((modulePath = resolver(module, dirname))) {
      break;
    }
  }

  return modulePath;
}

export function requireg(module) {
  try {
    return require(resolve(module, undefined))
  } catch (e) {
    throw new Error(`Could not require module '${ module }'. ${e}`);
  }
}
