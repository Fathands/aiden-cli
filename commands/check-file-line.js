
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const { execSync } = require('child_process');
const { error } = require('../utils/logger-util');

/**
 * @description: 创建项目
 * @param {type}
 * @return:
 */
async function checkFileLine() {
  const cwd = process.cwd();
  // 工程目录
  const project_dir = path.resolve(cwd);

  try {
    const results = execSync('git status', { encoding: 'utf-8' });
    const results_list = results.split('\n').map((item) => {
      const index = item.indexOf('src');
      return index !== -1 ? `src${item.slice(index + 3)}` : '';
    }).filter((item) => item);

    // eslint-disable-next-line no-useless-escape
    const reg_target = new RegExp('.*src/.+\.(js|json|scss|vue|less)$');
    // 需要检测的文件列表
    const target_list = results_list.filter((item) => (reg_target.test(item)));

    if (target_list.length) {
      // 合并获得文件的绝对目录
      const files_list = target_list.map((item) => path.join(project_dir, item));

      // 每个文件有多少行的list
      const file_result_list = files_list.map((file_url) => {
        const content = fs.readFileSync(file_url);
        const content_line_list = content.toString('utf8').split('\n').filter((value) => value !== '');
        return {
          file_url,
          file_length: content_line_list.length,
        };
      });

      // 超过1200行就抛出错误
      if (file_result_list.some((item) => item.file_length > 1200)) {
        const err_line_list = file_result_list.filter((item) => item.file_length > 1200);
        const err_string = err_line_list.map((item) => item.file_url).join('\n');

        console.log(chalk.red('\n'));
        console.log(chalk.red('检测到以下文件行数超过了1200行，请优化代码后重新提交'));
        console.log(chalk.red('\n'));
        console.log(chalk.cyan(err_string));
        console.log(chalk.red('\n'));

        process.exit(1);
      }
      process.exit(0);
    }
    process.exit(0);
  } catch (err) {
    console.log(err.stdout);
    process.exit(1);
  }
}

module.exports = (...args) => checkFileLine(...args).catch((err) => {
  error(err);
});
