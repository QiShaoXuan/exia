const log = require('signale');
const simpleGit = require('simple-git');
const git = simpleGit();
const fs = require('fs-extra');

const Publisher = require('./Publisher');
// 检查 git 状态，默认全部提交才能发布
const checkGitStatus = async () => {
  const git = simpleGit();
  const { files, staged, ahead, behind } = await git.status();
  if (files.length) {
    log.error('git 全部提交后才能进行发布');
    process.exit();
  }

  if (staged.length || ahead !== 0 || behind !== 0) {
    log.error('git 和远程commit不一致');
    process.exit();
  }
};

module.exports = async function (options) {
  const isRoot = await fs.pathExists(`${process.cwd()}/package.json`);
  if (!isRoot) {
    log.error('当前目录下不存在 package.json');
    process.exit();
  }

  const { nogitcheck } = options;

  if (!nogitcheck) {
    // await checkGitStatus();
  }

  const publisher = new Publisher(options);
  await publisher.publish();
};
