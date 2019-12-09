/*
 * @Author: Aiden
 * @Date: 2019-12-09 10:47:47
 * @LastEditors: Aiden
 * @LastEditTime: 2019-12-09 15:26:38
 */

const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const execa = require('execa');
const ora = require('ora');
const os = require('os');
const download = require('download-git-repo');

const spinner = ora();
const { error, clearConsole } = require('./logger-util');

/**
 * @description: 创建工程目录
 * @param {type}
 * @return: 创建状态
 */
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

/**
 * @description: 下载预设模板函数
 * @param {type}
 * @return:
 */
async function loadRemotePreset(name) {
  const remote_preset_map = {
    single_page: 'github:Fathands/templates-for-cli#single-page',
    multiple_pages: 'github:Fathands/templates-for-cli#multiple-pages',
  };

  const tmpdir = path.join(os.tmpdir(), 'template-aiden-cli');
  await fs.remove(tmpdir);

  await new Promise((resolve, reject) => {
    // 这里可以根据具体的模板地址设置下载的url，注意，如果是git，url后面的branch不能忽略
    download(remote_preset_map[name], tmpdir, { clone: false }, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  return tmpdir;
}

/**
 * @description: 获取预设模板
 * @param {type}
 * @return: 返回的是下载了预设模板的临时文件夹
 */
async function fetchingRemotePreset() {
  let preset_tmpdir;
  const { template } = await inquirer.prompt([
    {
      name: 'template',
      type: 'list',
      message: '请选择页面配置方式',
      choices: [
        { name: '单页面', value: 'single_page' },
        { name: '多页面', value: 'multiple_pages' },
      ],
    },
  ]);
  await clearConsole();
  spinner.text = `Fetching remote preset ${chalk.cyan(template)}...`;
  spinner.start();
  try {
    preset_tmpdir = await loadRemotePreset(template);
    spinner.stop();
  } catch (e) {
    spinner.stop();
    error(`Failed fetching remote preset ${chalk.cyan(template)}:`);
    throw e;
  }
  return preset_tmpdir;
}

/**
 * @description: 将临时目录下的文件拷贝到目标文件夹
 * @param {type}
 * @return: 返回的是拷贝完成以后的目录下的 package.json
 */
async function copyFile(temp, target) {
  await fs.copy(temp, target);
  await fs.remove(path.resolve(target, './.git'));
  const package_json = await fs.readJson(`${target}/package.json`);
  return package_json;
}

/**
 * @description: 生成新的工程
 * @param {type}
 * @return: 新的 package.json
 */
async function generateProject(name, target_dir, preset_tmpdir) {
  console.log(chalk.blue.bold(`aiden-cli v${require('../package.json').version}`));
  console.log(`\n✨  正在创建项目 ${chalk.yellow(target_dir)}...\n`);

  // 设置文件名，版本号等
  const { package_vertions, package_des, package_author } = await inquirer.prompt([
    {
      name: 'package_author',
      message: '请输入作者',
      default: 'aidenhuang <aidenhuang@lexin.com>',
    },
    {
      name: 'package_vertions',
      message: '请输入项目版本号',
      default: '0.0.1',
    },
    {
      name: 'package_des',
      message: '请输入项目简介',
      default: 'project created by aiden-cli',
    },
  ]);

  // 将下载的临时文件拷贝到项目中
  const package_json = await copyFile(preset_tmpdir, target_dir);

  const package_json_new = Object.assign(package_json, {
    name,
    author: package_author,
    version: package_vertions,
    description: package_des,
  });
  return package_json_new;
}

async function writeFileTree(dir, files) {
  Object.keys(files).forEach((name) => {
    const filePath = path.join(dir, name);
    fs.ensureDirSync(path.dirname(filePath));
    fs.writeFileSync(filePath, files[name]);
  });
}

/**
 * @description: 生产readme
 * @param {type}
 * @return:
 */
function generateReadme(pkg) {
  return [
    `# ${pkg.name}`,
    `## ${pkg.description}`,
    `> ${pkg.description}。`,
    '## 开发配置',
    '',
    '端口号：8115',
    '',
    'nginx配置中，在鹰眼域名server下添加如下配置：',
    '',
    '```',
    '',
    '# 项目名称',
    '',
    'location /falcon {',
    '',
    '    proxy_pass http://127.0.0.1:8115/falcon;',
    '',
    '}',
    '',
    '```',
  ].join('\n');
}

/**
 * @description: 重写一些配置文件
 * @param {type}
 * @return:
 */
async function rewriteFiles(package_json, target_dir) {
  spinner.text = `📄  生成 ${chalk.yellow('package.json')} 等配置文件`;
  spinner.start();

  await writeFileTree(target_dir, {
    'package.json': JSON.stringify(package_json, null, 4),
    'README.md': generateReadme(package_json),
  });

  spinner.stop();
}

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


/**
 * @description: 创建成功
 * @param {type}
 * @return:
 */
function createSuccess(name) {
  console.log(`\n✨  项目创建成功 ${chalk.yellow(name)}.`);
  console.log(`\n✨  请按如下命令，开始愉快开发吧！\n\n${
    this.target_dir === process.cwd() ? '' : chalk.cyan(` ${chalk.gray('$')} cd ${name}\n`)
  }${chalk.cyan(` ${chalk.gray('$')} npm run dev\n`)
  }${chalk.cyan(` ${chalk.gray('$')} npm run build`)}`);
}

module.exports = {
  installDeps,
  createProjectDir,
  fetchingRemotePreset,
  generateProject,
  rewriteFiles,
  createSuccess,
};
