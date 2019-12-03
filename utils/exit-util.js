/*
 * @Author: Aiden
 * @Date: 2019-12-03 16:31:35
 * @LastEditors: Aiden
 * @LastEditTime: 2019-12-03 16:31:47
 */

/**
 * @description: 退出
 * @param {type} 
 * @return: 
 */
exports.exit = function (code) {
  if (code > 0) {
    throw new Error(`Process exited with code ${code}`)
  }
}