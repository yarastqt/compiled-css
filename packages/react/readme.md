# @steely/react

## Jest

Usage with `jest` needed add module mapper to generate stable className hashes

**jest.config.js**

```js
module.exports = {
  moduleNameMapper: {
    '@steely/react': '@steely/react/lib/jest',
  },
}
```
