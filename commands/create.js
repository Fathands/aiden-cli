/*
 * @Author: Aiden
 * @Date: 2019-12-03 11:30:27
 * @LastEditors: Aiden
 * @LastEditTime: 2019-12-04 16:23:56
 */

const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');

const Creator = require('./Creator')
const { error, clearConsole } = require('../utils/logger-util');

const spinner = ora();

/**
 * @description: 创建项目
 * @param {type} 
 * @return: 
 */
async function create (projectName, options) {
  const cwd = options.cwd || process.cwd()
  
  // 是否在当前目录
  const inCurrent = projectName === '.'
  const name = inCurrent ? path.relative('../', cwd) : projectName
  const targetDir = path.resolve(cwd, projectName || '.')
  
  await clearConsole();
    
  if (inCurrent) {
    const { ok } = await inquirer.prompt([
      {
        name: 'ok',
        type: 'confirm',
        message: '是否在当前文件夹下创建项目？'
      }
    ])
    if (!ok) {
      return
    }
  } else if (fs.existsSync(targetDir)) { // 检查文件夹是否存在
    const { action } = await inquirer.prompt([
      {
        name: 'action',
        type: 'list',
        message: `目标文件夹 ${chalk.cyan(targetDir)} 已经存在，请选择：`,
        choices: [
          { name: '覆盖', value: true },
          { name: '取消', value: false }
        ]
      }
    ])
    if (!action) {
      return
    } else if (action) {
      spinner.text = `${chalk.red('removing')} ${chalk.cyan(targetDir)}`
      spinner.start()
      await fs.remove(targetDir)
      spinner.stop()
    }
  }
  await clearConsole()

  // 前面完成准备工作，正式开始创建项目
  const creator = new Creator(name, targetDir)
  await creator.create(options)
}

module.exports = (...args) => {
  return create(...args).catch(err => {
    spinner.stop()
    error(err)
  })
}