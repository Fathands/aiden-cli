/*
 * @Author: Aiden
 * @Date: 2019-12-03 11:30:27
 * @LastEditors: Aiden
 * @LastEditTime: 2019-12-09 11:29:22
 */

const path = require('path');
const ora = require('ora');

const Creator = require('./Creator');
const { createProjectDir } = require('../utils/create-util');
const { error, clearConsole } = require('../utils/logger-util');

const spinner = ora();

/**
 * @description: 创建项目
 * @param {type}
 * @return:
 */
async function create(project_name, options) {
  const cwd = options.cwd || process.cwd();

  // 是否在当前目录
  const in_current = project_name === '.';
  const name = in_current ? path.relative('../', cwd) : project_name;

  // 工程目录
  const target_dir = path.resolve(cwd, project_name || '.');

  // 创建工程目录
  await clearConsole();
  const create_status = await createProjectDir(in_current, target_dir);
  if (!create_status) return;

  // 前面完成准备工作，正式开始创建项目
  await clearConsole();
  const creator = new Creator(name, target_dir);
  await creator.create(options);
}

module.exports = (...args) => create(...args).catch((err) => {
  spinner.stop();
  error(err);
});
