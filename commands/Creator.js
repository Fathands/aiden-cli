const chalk = require('chalk')
const inquirer = require('inquirer')
const EventEmitter = require('events')
const ora = require('ora')
const spinner = ora()
// const loadRemotePreset = require('../lib/utils/loadRemotePreset')
// const writeFileTree = require('../lib/utils/writeFileTree')
// const copyFile = require('../lib/utils/copyFile')
// const generateReadme = require('../lib/utils/generateReadme')
// const {installDeps} = require('../lib/utils/installDeps')

// const {
//   defaults
// } = require('../lib/options')

// const {
//   // log,
//   // error,
//   // hasYarn,
//   // hasGit,
//   // hasProjectGit,
//   // logWithSpinner,
//   clearConsole,
//   // stopSpinner,
//   // exit
// } = require('../lib/utils/common')

const { error, clearConsole } = require('../utils/logger-util');
const loadRemotePreset = require('../utils/load-remote-preset-util');
const copyFile = require('../utils/copy-file-util');
const writeFileTree = require('../utils/write-file-tree-util');
const generateReadme = require('../utils/generate-readme-util');

module.exports = class Creator extends EventEmitter {
  constructor(name, target_dir) {
    super()

    this.name = name
    this.target_dir = target_dir
  }

  async create(cliOptions = {}) {
    const { run, name, target_dir } = this
    let preset = null
    
    const { template } = await inquirer.prompt([
      {
        name: 'template',
        type: 'list',
        message: '请选择页面配置方式',
        choices: [
          { name: '单页面', value: 'single_page' },
          { name: '多页面', value: 'multiple_pages' }
        ]
      }
    ])
    await clearConsole()
    spinner.text = `Fetching remote preset ${chalk.cyan(template)}...`
    spinner.start()
    try {
      preset = await loadRemotePreset(template, this.target_dir)
      spinner.stop()
    } catch (e) {
      spinner.stop()
      error(`Failed fetching remote preset ${chalk.cyan(template)}:`)
      throw e
    }
    
    await clearConsole()
    console.log(chalk.blue.bold(`aiden-cli v${require('../package.json').version}`))
    console.log(`\n✨  正在创建项目 ${chalk.yellow(target_dir)}...\n`);
    
    // 设置文件名，版本号等
    const { package_vertions, package_des, package_author } = await inquirer.prompt([
      {
        name: 'package_author',
        message: `请输入作者`,
        default: 'aidenhuang <aidenhuang@lexin.com>',
      },
      {
        name: 'package_vertions',
        message: `请输入项目版本号`,
        default: '0.0.1',
      },
      {
        name: 'package_des',
        message: `请输入项目简介`,
        default: 'project created by aiden-cli',
      }
    ])

    // 将下载的临时文件拷贝到项目中
    const package_json = await copyFile(preset.tmpdir, preset.targetDir)

    const package_json_new = Object.assign(package_json, {
      name: name,
      author: package_author,
      version: package_vertions,
      description: package_des
    })

    // write package.json
    await clearConsole()
    spinner.text = `📄  生成 ${chalk.yellow('package.json')} 等模板文件`
    spinner.start()

    await writeFileTree(target_dir, {
      'package.json': JSON.stringify(package_json_new, null, 4),
      'README.md': generateReadme(package_json_new)
    })

    spinner.stop()
    
    // 安装依赖
    await clearConsole()
    spinner.text = `⚙  安装依赖`
    spinner.start()
    // const packageManager = (
    //   (hasYarn() ? 'yarn' : null) ||
    //   (hasPnpm3OrLater() ? 'pnpm' : 'npm')
    // )
    
    // await installDeps(target_dir, packageManager, cliOptions.registry)
    spinner.stop()
      
    // log instructions
    await clearConsole()
    console.log(`\n✨  项目创建成功 ${chalk.yellow(name)}.`)
    console.log(`\n✨  请按如下命令，开始愉快开发吧！\n\n` +
      (this.target_dir === process.cwd() ? `` : chalk.cyan(` ${chalk.gray('$')} cd ${name}\n`)) +
      chalk.cyan(` ${chalk.gray('$')} npm run dev\n`)+
      chalk.cyan(` ${chalk.gray('$')} npm run build`)
    )
  }
}