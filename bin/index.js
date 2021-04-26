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
  .command('publish')
  .description('发布项目至npm')
  .option('-cv, --custom-version <version>', '更新指定版本到 package.json')
  .option('-ngc, --nogitcheck', '不检查 git 状态', false)
  .option('-p, --prereleaseId [prereleaseId]', '发布/更新预发布版本：beta, alpha, RC ...', 'beta')
  .option('-nt, --notag', '是否使用 git tag', false)
  .action((options) => {
    require('../lib/publish')(options);
  });

program.parse(process.argv);
