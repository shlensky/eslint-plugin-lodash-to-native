# Enforce use of native [].map method without lodash

## Rule Details

Examples of **incorrect** code for this rule:

```js

_.map([1,2,3], () => ...)

```

Examples of **correct** code for this rule:

```js

[1,2,3].map(() => ...)

```
