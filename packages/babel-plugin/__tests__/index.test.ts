import tester from 'babel-plugin-tester'

import plugin from '../src/index'

tester({
  plugin,
  title: '@steely/babel-plugin',
  filename: __filename,
  tests: [
    {
      title: 'should transpile styles to static',
      fixture: '__fixtures__/default/input.js',
      outputFixture: '__fixtures__/default/output.js',
    },
    {
      title: 'should transpile styles to static with module extends',
      fixture: '__fixtures__/extends-module/input.js',
      outputFixture: '__fixtures__/extends-module/output.js',
    },
    {
      title: 'should transpile styles with nested',
      fixture: '__fixtures__/nested/input.js',
      outputFixture: '__fixtures__/nested/output.js',
    },
    {
      title: 'should transpile styles into object property',
      fixture: '__fixtures__/object-property/input.js',
      outputFixture: '__fixtures__/object-property/output.js',
    },
  ],
})
