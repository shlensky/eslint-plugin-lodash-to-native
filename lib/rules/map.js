/**
 * @fileoverview Replace lodash _.map([]) to native [].map
 * @author Dmitriy Shlenskiy
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description: "Enforce use of native [].map method without lodash",
            category: "Best Practices",
            recommended: true
        },
        fixable: "code",
        schema: []
    },

    create: function(context) {

        var sourceCode = context.getSourceCode();

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            CallExpression: function(node) {
                if (node.callee.type === "MemberExpression" &&
                    node.callee.object.name === "_" &&
                    node.callee.property.name === "map" &&
                    node.arguments.length === 2) {

                    context.report({
                        node,
                        message: "Use native [].map method for arrays instead of lodash _.map",
                        fix: function(fixer) {
                            var arg1 = sourceCode.getText(node.arguments[0]);
                            var arg2 = sourceCode.getText(node.arguments[1]);
                            var fixedCode = `Array.isArray(${arg1}) ? ${arg1}.map(${arg2}) : ${sourceCode.getText(node)}`;

                            return fixer.replaceText(node, fixedCode);
                        }
                    });
                }
            }
        };
    }
};
