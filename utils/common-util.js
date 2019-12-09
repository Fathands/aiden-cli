/*
 * @Author: Aiden
 * @Date: 2019-12-03 11:35:52
 * @LastEditors: Aiden
 * @LastEditTime: 2019-12-09 11:32:23
 */

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

module.exports = {
  cleanArgs
}