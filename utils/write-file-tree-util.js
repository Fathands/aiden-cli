/*
 * @Author: Aiden
 * @Date: 2019-12-06 16:02:11
 * @LastEditors: Aiden
 * @LastEditTime: 2019-12-06 16:02:25
 */
const fs = require('fs-extra');
const path = require('path');

module.exports = async function writeFileTree(dir, files) {
  Object.keys(files).forEach((name) => {
    const filePath = path.join(dir, name);
    fs.ensureDirSync(path.dirname(filePath));
    fs.writeFileSync(filePath, files[name]);
  });
};
