/*
 * @Author: Aiden
 * @Date: 2019-12-03 11:30:27
 * @LastEditors: Aiden
 * @LastEditTime: 2019-12-09 15:39:39
 */

const path = require('path');
const ora = require('ora');

const {
  createProjectDir,
  installDeps,
  fetchingRemotePreset,
  generateProject,
  rewriteFiles,
  createSuccess,
} = require('../utils/create-util');
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

  // 获取预设模板
  await clearConsole();
  const preset_tmpdir = await fetchingRemotePreset();

  // 生产工程
  await clearConsole();
  const package_json = await generateProject(name, target_dir, preset_tmpdir);

  // 重写 package.json 和 README.md
  await clearConsole();
  await rewriteFiles(package_json, target_dir);

  // 安装依赖
  await clearConsole();
  await installDeps(target_dir);

  // 创建成功
  await clearConsole();
  createSuccess(name);
}

module.exports = (...args) => create(...args).catch((err) => {
  spinner.stop();
  error(err);
});
