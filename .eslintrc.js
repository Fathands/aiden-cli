/*
 * @Author: Aiden
 * @Date: 2019-12-09 11:42:24
 * @LastEditors: Aiden
 * @LastEditTime: 2019-12-09 14:25:58
 */

module.exports = {
    root: true,
    parserOptions: {
      ecmaVersion: 2017
    },
    env: {
      browser: true,
      es6: true,
      node: true,
      commonjs: true
    },
    extends: [
      'airbnb-base',
    ],
    /**
     * 规则的错误等级有三种
     * "off" 或者 0：关闭规则。
     * "warn" 或者 1：打开规则，并且作为一个警告（不影响exit code）。
     * "error" 或者 2：打开规则，并且作为一个错误（exit code将会是1）。
     */
    rules: {
      'no-console': 0,
      'linebreak-style': 0,
      'no-unused-vars': 1,
      'global-require': 0,
      'camelcase': 0,
      'prefer-promise-reject-errors': 0,
      'consistent-return': 0
    }
  }
