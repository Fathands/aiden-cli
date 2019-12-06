/*
 * @Author: Aiden
 * @Date: 2019-12-03 11:35:52
 * @LastEditors: Aiden
 * @LastEditTime: 2019-12-06 18:50:55
 */

const ora = require('ora')
const execa = require('execa')
const spinner = ora()

/**
 * @description: 大写
 * @param {type} 
 * @return: 
 */
function camelize (str) {
  return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}

/**
 * @description: 获取参数
 * @param {type} 
 * @return: 
 */
function cleanArgs(cmd) {
  const args = {}
  cmd.options.forEach(o => {
    const key = camelize(o.long.replace(/^--/, ''));
    // 如果没有传递option或者有与之相同的命令，则不被拷贝
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })
  return args
}

/**
 * @description: 安装依赖
 * @param {type} 
 * @return: 
 */
async function installDeps (targetDir) {
  console.log('\n');
  spinner.text = `⚙  安装依赖中...`
  spinner.start()
  let args = ['install', '--loglevel', 'error']
  
  return new Promise((resolve, reject) => {

    const child = execa('npm', args, {
      cwd: targetDir
    })

    child.on('close', code => {
      if (code !== 0) {
        reject(`command failed: npm ${args.join(' ')}`)
        spinner.stop()
        return
      }
      spinner.stop()
      resolve()
    })
  })
}

module.exports = {
  cleanArgs,
  installDeps
}