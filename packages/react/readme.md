# @compiled-css/react

## Jest

Usage with `jest` needed add module mapper to generate stable className hashes

**jest.config.js**

```js
module.exports = {
  moduleNameMapper: {
    '@compiled-css/react': '@compiled-css/react/lib/jest',
  },
}
```
