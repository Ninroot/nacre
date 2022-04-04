'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var mocha_1 = require("mocha");
var assert = require("assert/strict");
var annotations_1 = require("../src/annotations");
(0, mocha_1.describe)('ls unit test', function () {
    (0, mocha_1.it)('should return a non empty array when no args', function () {
        var expression = {
            type: 'CallExpression',
            start: 0,
            end: 12,
            callee: {
                type: 'MemberExpression',
                start: 0,
                end: 11,
                object: [Object],
                property: [Object],
                computed: false,
                optional: false,
            },
            arguments: [],
            optional: false,
        };
        // eslint-disable-next-line no-console
        var actual = (0, annotations_1.completeCall)(console.log, expression, 'console.log(');
        assert.strictEqual(actual, '...data');
    });
});
