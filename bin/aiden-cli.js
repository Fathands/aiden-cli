#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const minimist = require('minimist');

const { cleanArgs } = require('../utils/common-util');

const { version } = require('../package');

program.version(version, '-v, --version');

program.usage('<command> [option]');

program.command('create <app-name>')
  .option('-d --dir <dir>', 'create a directory')
  .description('create a new project')
  .action((name, command) => {
    const options = cleanArgs(command);
    if (minimist(process.argv.slice(3))._.length > 1) {
      console.log(chalk.yellow('\n ⚠️  检测到您输入了多个名称，将以第一个参数为项目名，舍弃后续参数哦'));
    }
    require('../commands/create.js')(name, options);
  });

program.command('cz')
  .description('tool for git commit')
  .action(() => {
    require('../commands/cz.js');
  });

program.parse(process.argv);
