/*
 * @Author: Aiden
 * @Date: 2019-12-06 14:10:32
 * @LastEditors: Aiden
 * @LastEditTime: 2019-12-06 15:40:58
 */
const fs = require('fs-extra')
const os = require('os')
const path = require('path')
const download = require('download-git-repo')

const remotePresetMap = {
  single_page: 'github:Fathands/templates-for-cli#single-page',
  multiple_pages: 'github:Fathands/templates-for-cli#multiple-pages'
}

module.exports = async function (name, targetDir) {
  const tmpdir = path.join(os.tmpdir(), 'template-aiden-cli')
  await fs.remove(tmpdir)

  await new Promise((resolve, reject) => {
    
    // 这里可以根据具体的模板地址设置下载的url，注意，如果是git，url后面的branch不能忽略
    download(remotePresetMap[name], tmpdir, { clone: false }, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })

  return {
    targetDir,
    tmpdir
  }
}