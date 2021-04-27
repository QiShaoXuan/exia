#!/usr/bin/env node
const log = require('signale');
const semver = require('semver');
const packageJSON = require('../package');

function checkNodeVersion(wanted, id) {
  if (!semver.satisfies(process.version, wanted, { includePrerelease: true })) {
    log.error(
      `You are using Node ${process.version}, but this version of ${id} requires Node ${wanted}.\nPlease upgrade your Node version.`,
    );
    process.exit(1);
  }
}

checkNodeVersion(packageJSON.engines.node, packageJSON.name);

const program = require('commander');

program
  .version(`${packageJSON.name} ${require('../package').version}`)
  .usage('<command> [options]');

program
  .command('version')
  .description('更新版本号')
  .option('--custom-version <version>', '自定义版本号')
  .option('--no-gitcheck', '不检查 git 状态', false)
  .option('-p, --prereleaseId [prereleaseId]', '自定义预发版本前缀：beta, alpha, RC ...', 'beta')
  .option('--no-tag', '不添加 git tag', false)
  .action(async (options) => {
    const Version = require('../lib/Version');
    const version = new Version(options);
    await version.upgrade();
  });

program.parse(process.argv);
