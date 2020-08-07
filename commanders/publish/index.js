#!/usr/bin/env node
const fs = require("fs-extra");
const program = require("commander");
const chalk = require("chalk");
const simpleGit = require("simple-git");
const git = simpleGit();
const inquirer = require("inquirer");
const logSymbols = require("log-symbols");

modules.exports = async () => {
  program
    .command("publish")
    .description("发布项目")
    .action(async (fileDir, cmd) => {
      const { spawn, execSync } = require("child_process");
      const noCommit = !!execSync("git status -s", {
        encoding: "utf8"
      });

      if (noCommit) {
        return console.log(chalk.red("git 全部提交后才能进行发布"));
      }
      const pkgDir = require("pkg-dir");
      const rootDir = await pkgDir(process.cwd());
      const packageJSON = require(`${rootDir}/package.json`);
      const { version } = packageJSON;
      let publishVersion = "";
      const { custom } = await inquirer.prompt([
        {
          name: "custom",
          type: "list",
          message: `当前版本为：${version}，自定义版本号？`,
          choices: [
            { name: "是", value: true },
            { name: "否", value: false }
          ],
          default: false
        }
      ]);

      if (custom) {
        const { customVersion } = await inquirer.prompt([
          {
            name: "customVersion",
            type: "input",
            message: `输入版本号：`
          }
        ]);
        publishVersion = customVersion;
      } else {
        const versionSplit = version.split(".");
        versionSplit[2] = Number(versionSplit[2]) + 1;
        publishVersion = versionSplit.join(".");
      }
      console.log(chalk.green(`更新版本为：${publishVersion}`));
      packageJSON.version = publishVersion;

      fs.outputFile(
        `${rootDir}/package.json`,
        JSON.stringify(packageJSON, null, 2)
      );

      console.log(logSymbols.success, chalk.green(`更新 package.json`));

      await git.add(`${rootDir}/package.json`);
      await git.commit(`publish version ${publishVersion}`);
      await git.push();
      await git.addTag(`v${publishVersion}`);
      await git.pushTags();
      console.log(
        logSymbols.success,
        chalk.green(`添加 git tag v${publishVersion}`)
      );

      const pub = spawn("npm", ["publish"]);

      pub.stdout.on("data", data => {
        console.log(`${data}`);
      });

      pub.stderr.on("data", data => {
        console.log(`${data}`);
      });

      pub.on("close", code => {
        console.log(logSymbols.success, chalk.green(`发布成功`));
      });
    });
};
