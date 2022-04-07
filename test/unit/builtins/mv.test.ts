'use strict';

import {describe, it, beforeEach} from "mocha";

import path = require('path');
import * as assert from 'assert/strict'

import stat = require('../../../src/builtins/stat');
import mv = require('../../../src/builtins/mv');
import {rmSync, cpSync} from "fs";

describe('mv unit test', () => {
    const template = path.join(__dirname, 'fixtures', 'mv', 'template');
    const tmp = path.join(__dirname, 'fixtures', 'mv', 'tmp');

    beforeEach('setup directory structure', () => {
        rmSync(tmp, {
            recursive: true,
            force: true
        });
        cpSync(template, tmp, {
            recursive: true,
            force: true,
        });
    });

    it('nominal f0 -> d1/', () => {
        const {newPath} = mv(path.join(tmp, 'f0'), path.join(tmp, 'd1'));
        assert.equal(stat(newPath).type, "file")
    })

    it('nominal d1/ -> d2/', () => {
        const d1 = path.join(tmp, 'd1');
        const d2 = path.join(tmp, 'd2');
        const {newPath} = mv(d1, d2);
        assert.equal(stat(newPath).type, "directory")
    })

    it('attempt f0 -> f00', () => {
        const f0 = path.join(tmp, 'f0');
        const f00 = path.join(tmp, 'f00');
        assert.throws(() => mv(f0, f00), {message: /Item can only be moved in a directory/})
    })

    it('attempt d1/f1 -> d2/f1', () => {
        const f11 = path.join(tmp, 'd1', 'f1');
        const d2 = path.join(tmp, 'd2');
        assert.throws(() => mv(f11, d2), {message: /Item already exists in the destination directory/})
    })

    it('attempt d1 -> d1', () => {
        assert.throws(() => mv(path.join(tmp, 'd1'), tmp),
            {message: /Item already exists in the destination directory/}
        )
    })
})
