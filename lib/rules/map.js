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

        const sourceCode = context.getSourceCode();

        function fixWithoutCondition(node) {
            return function(fixer) {
                const arg1 = sourceCode.getText(node.arguments[0]);
                const arg2 = sourceCode.getText(node.arguments[1]);
                const fixedCode = `${arg1}.map(${arg2})`;

                return fixer.replaceText(node, fixedCode);
            };
        }

        function fixWithCondition(node) {
            return function(fixer) {
                const arg1 = sourceCode.getText(node.arguments[0]);
                const arg2 = sourceCode.getText(node.arguments[1]);
                const fixedCode = `Array.isArray(${arg1}) ? ${arg1}.map(${arg2}) : ${sourceCode.getText(node)}`;

                return fixer.replaceText(node, fixedCode);
            };
        }

        function reportAndFix(node, fix) {
            context.report({
                node,
                message: "Use native [].map method for arrays instead of lodash _.map",
                fix
            });
        }

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            "CallExpression[callee.object.name=_][callee.property.name=map][arguments.length=2]": function(node) {
                switch (node.arguments[0].type) {
                    case "ObjectExpression":
                        // do nothing
                        return;

                    case "ArrayExpression":
                        reportAndFix(node, fixWithoutCondition(node));
                        return;

                    default:
                        reportAndFix(node, fixWithCondition(node));
                        return;
                }
            }
        };
    }
};
