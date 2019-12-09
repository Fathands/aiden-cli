/*
 * @Author: Aiden
 * @Date: 2019-12-09 10:47:47
 * @LastEditors: Aiden
 * @LastEditTime: 2019-12-09 11:31:09
 */

const fs = require('fs-extra');
const inquirer = require('inquirer');
const chalk = require('chalk');
const execa = require('execa');
const ora = require('ora');

const spinner = ora();

/**
 * @description: 安装依赖
 * @param {type}
 * @return:
 */
function installDeps(targetDir) {
  console.log('\n');
  spinner.text = '⚙  安装依赖中...';
  spinner.start();
  const args = ['install', '--loglevel', 'error'];

  return new Promise((resolve, reject) => {
    const child = execa('npm', args, {
      cwd: targetDir,
    });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(`command failed: npm ${args.join(' ')}`);
        spinner.stop();
        return;
      }
      spinner.stop();
      resolve();
    });
  });
}

async function createProjectDir(in_current, target_dir) {
  if (in_current) {
    const { ok } = await inquirer.prompt([
      {
        name: 'ok',
        type: 'confirm',
        message: '是否在当前文件夹下创建项目？',
      },
    ]);
    if (!ok) {
      return ok;
    }
  } else if (fs.existsSync(target_dir)) { // 检查文件夹是否存在
    const { action } = await inquirer.prompt([
      {
        name: 'action',
        type: 'list',
        message: `目标文件夹 ${chalk.cyan(target_dir)} 已经存在，请选择：`,
        choices: [
          { name: '覆盖', value: true },
          { name: '取消', value: false },
        ],
      },
    ]);
    if (!action) {
      return action;
    } if (action) {
      console.log('\n');
      spinner.text = `${chalk.red('removing')} ${chalk.cyan(target_dir)}`;
      spinner.start();
      await fs.remove(target_dir);
      spinner.stop();
    }
  }
  return true;
}

module.exports = {
  installDeps,
  createProjectDir,
};
