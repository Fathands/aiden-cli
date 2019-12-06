/*
 * @Author: Aiden
 * @Date: 2019-12-03 16:24:18
 * @LastEditors: Aiden
 * @LastEditTime: 2019-12-06 18:42:07
 */

const chalk = require('chalk');
const readline = require('readline');
const padStart = require('string.prototype.padstart');

const format = (label, msg) => {
  return msg.split('\n').map((line, i) => {
    return i === 0
      ? `${label} ${line}`
      : padStart(line, chalk.reset(label).length)
  }).join('\n')
}

const chalkTag = tag => chalk.bgBlackBright.white.dim(` ${tag} `)
 
/**
 * @description: 错误日志
 * @param {type} 
 * @return: 
 */
exports.error = (msg, tag = null) => {
  console.error(format(chalk.bgRed(' ERROR ') + (tag ? chalkTag(tag) : ''), chalk.red(msg)))
  if (msg instanceof Error) {
    console.error(msg.stack)
  }
}

/**
 * @description: 清除控制台
 * @param {type} 
 * @return: 
 */
exports.clearConsole = () => {
  if (process.stdout.isTTY) {
    const blank = '\n'.repeat(process.stdout.rows)
    console.log(blank)
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
  }
}