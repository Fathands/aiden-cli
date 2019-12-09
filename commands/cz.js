/*
 * @Author: Aiden
 * @Date: 2019-12-09 15:47:58
 * @LastEditors: Aiden
 * @LastEditTime: 2019-12-09 15:48:01
 */
const { prompt } = require('inquirer');

const { execSync } = require('child_process');
const commit_types = require('../constants/commit-types');

const question = [
  {
    type: 'list',
    name: 'type',
    message: '选择commit类型: ',
    choices: commit_types,
  },
  {
    type: 'input',
    name: 'description',
    message: '请简短地描述一下: ',
  },
];

module.exports = prompt(question).then(({ type, description }) => {
  try {
    const results = execSync(`git commit -m "${type}: ${description}"`, { encoding: 'utf-8' });
    console.log(results);
  } catch (err) {
    console.log(err.stdout);
    process.exit(0);
  }
});
