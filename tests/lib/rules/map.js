/**
 * @fileoverview Replace lodash _.map([]) to native [].map
 * @author Dmitriy Shlenskiy
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/map"),

    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const message = "Use native [].map method for arrays instead of lodash _.map";
const ruleTester = new RuleTester();
ruleTester.run("map", rule, {

    valid: [
        "$.map(collection, fn)",
        "_.flatMap(collection, fn)",
        "map(collection, fn)",
        "_.map(collection, fn, 3)",
        "_.map({a: 1}, fn)",
        "Array.isArray(collection) ? collection.map(fn) : _.map(collection, fn)",
        "Array.isArray(getCollection(blah, blah2)) ? getCollection(blah, blah2).map(fn) : _.map(getCollection(blah, blah2), fn)",
    ],

    invalid: [
        {
            code: "_.map(collection, fn)",
            errors: [{message}],
            output: "Array.isArray(collection) ? collection.map(fn) : _.map(collection, fn)"
        },
        {
            code: "function x() { return _.map(collection, fn); }",
            errors: [{message}],
            output: "function x() { return Array.isArray(collection) ? collection.map(fn) : _.map(collection, fn); }"
        },
        {
            code: "_.map([1, 2, 3], fn)",
            errors: [{message}],
            output: "[1, 2, 3].map(fn)"
        },
    ]
});
