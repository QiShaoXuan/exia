const fs = require('fs-extra');
const semver = require('semver');
const log = require('signale');
const inquirer = require('inquirer');

class Publisher {
  constructor(options) {
    const { customVersion, prereleaseId, notag } = options;

    this.customVersion = customVersion;
    this.prereleaseId = prereleaseId;
    this.packagePath = `${process.cwd()}/package.json`;
    this.packageJSON = require(this.packagePath);
    this.newVersion = '';
    this.notag = notag;
  }

  async publish() {
    try {
      this.newVersion = await this.getNewVersion();
      await this.writeVersionToPackageJSON();

      log.success(`版本号 ${this.newVersion} 更新成功`);

      if (!this.notag) {
        await this.updateGitTag();
      }
    } catch (e) {
      log.error(e.message);
    }
  }

  async updateGitTag() {}

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
  }
}

module.exports = Publisher;
