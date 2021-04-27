const fs = require('fs-extra');
const semver = require('semver');
const log = require('signale');
const inquirer = require('inquirer');
const simpleGit = require('simple-git');
const git = simpleGit();

class Version {
  constructor(options) {
    const { customVersion, prereleaseId, tag, npm, gitcheck } = options;

    this.customVersion = customVersion;
    this.prereleaseId = prereleaseId;
    this.packagePath = `${process.cwd()}/package.json`;
    this.packageJSON = require(this.packagePath);
    this.newVersion = '';
    this.tag = tag;
    this.npm = npm;
    this.gitcheck = gitcheck;
  }

  async upgrade() {
    try {
      await this.doPublishCheck();

      this.newVersion = await this.getNewVersion();

      await this.writeVersionToPackageJSON();

      await this.pushGit();

      if (this.tag) {
        await this.addGitTag();
      }
    } catch (e) {
      log.error(e.message);
      process.exit(1);
    }
  }

  async doPublishCheck() {
    const isRoot = await fs.pathExists(`${process.cwd()}/package.json`);
    if (!isRoot) {
      throw new Error('当前目录下不存在 package.json');
    }

    if (this.gitcheck) {
      await this.checkGitStatus();
    }
  }

  // 检查 git 状态，默认全部提交才能发布
  async checkGitStatus() {
    const { files, staged, ahead, behind } = await git.status();
    if (files.length) {
      throw new Error('git 全部提交后才能进行发布');
    }

    if (staged.length || ahead !== 0 || behind !== 0) {
      throw new Error('git 和远程commit不一致');
    }
  }

  async addGitTag() {
    const tagMsg = `v${this.newVersion}`;
    await git.addTag(tagMsg);
    await git.pushTags();

    log.success(`tag 标记成功：${tagMsg}`);
  }

  async pushGit() {
    await git.add(this.packagePath);
    await git.commit(`feat: publish version ${this.newVersion}`);
    await git.push();

    log.success('git 推送成功');
  }

  // publishToNPM() {
  //   const { spawn } = require('child_process');
  //   const pub = spawn('npm', ['publish']);
  //
  //   pub.stdout.on('data', (data) => {
  //     console.log(`${data}`);
  //   });
  //
  //   pub.stderr.on('data', (data) => {
  //     throw new Error(data);
  //   });
  //
  //   pub.on('close', (code) => {
  //     log.success('npm 发布成功');
  //   });
  // }

  async getNewVersion() {
    if (this.customVersion) {
      if (semver.valid(this.customVersion) === null) {
        throw new Error(`${this.customVersion} 不是有效的版本号`);
      }
      return this.customVersion;
    }

    const packageJSON = require(`${process.cwd()}/package.json`);

    return await this.incVersion(packageJSON.name, packageJSON.version, this.prereleaseId);
  }

  async incVersion() {
    const currentVersion = this.packageJSON.version;
    const packageName = this.packageJSON.name;
    const prereleaseId = this.prereleaseId;

    const patch = semver.inc(currentVersion, 'patch');
    const minor = semver.inc(currentVersion, 'minor');
    const major = semver.inc(currentVersion, 'major');
    const prepatch = semver.inc(currentVersion, 'prepatch', prereleaseId);
    const preminor = semver.inc(currentVersion, 'preminor', prereleaseId);
    const premajor = semver.inc(currentVersion, 'premajor', prereleaseId);
    const prerelease = semver.inc(currentVersion, 'prerelease', prereleaseId);

    const { version } = await inquirer.prompt([
      {
        name: 'version',
        type: 'list',
        message: `Select a new version ${
          packageName ? `for ${packageName} ` : ''
        }(currently ${currentVersion})`,
        choices: [
          { value: patch, name: `Patch (${patch})` },
          { value: minor, name: `Minor (${minor})` },
          { value: major, name: `Major (${major})` },
          { value: prepatch, name: `Prepatch (${prepatch})` },
          { value: preminor, name: `Preminor (${preminor})` },
          { value: premajor, name: `Premajor (${premajor})` },
          { value: prerelease, name: `Prerelease (${prerelease})` },
        ],
      },
    ]);

    return version;
  }

  async writeVersionToPackageJSON() {
    await fs.outputFile(
      this.packagePath,
      JSON.stringify(Object.assign({}, this.packageJSON, { version: this.newVersion }), null, 2),
    );

    log.success(`版本号 ${this.newVersion} 更新成功`);
  }
}

module.exports = Version;
