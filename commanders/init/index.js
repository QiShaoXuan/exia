const path = require("path");
const fs = require("fs-extra");
const inquirer = require("inquirer");
const chalk = require("chalk");
const logSymbols = require("log-symbols");
const program = require("commander");

module.exports = async () => {
  program
    .command("init <projectName>")
    .description("初始化文件，添加基础文件")
    .action(async (projectName, cmd) => {
      //开始创建
      const cwd = process.cwd();
      const inCurrent = projectName === ".";
      const targetDir = path.resolve(cwd, projectName || ".");

      if (!inCurrent && fs.existsSync(targetDir)) {
        return console.log(
          chalk.yellow(
            `已存在文件 ${projectName}，可进入文件后使用 exia init . 初始化。`
          )
        );
      }

      if (inCurrent) {
        const { ok } = await inquirer.prompt([
          {
            name: "ok",
            type: "confirm",
            message: `Init project in current directory?`
          }
        ]);
        if (!ok) {
          return;
        }
      } else {
        const { action } = await inquirer.prompt([
          {
            name: "action",
            type: "list",
            message: `目标路径 ${chalk.cyan(targetDir)} 已存在. 请选择:`,
            choices: [
              { name: "覆盖", value: "overwrite" },
              { name: "取消", value: false }
            ]
          }
        ]);
        if (!action) {
          return;
        }
        if (action === "overwrite") {
          console.log(`\n移除 ${chalk.cyan(targetDir)}...`);
          await fs.remove(targetDir);
        }
      }

      const rootDir = await require("../../lib/getDir").getCommandRootDir();

      const tempDir = path.resolve(rootDir, "./temp/init");

      await fs.copy(tempDir, targetDir);

      console.log(
        logSymbols.success,
        chalk.green(`初始化成功，初始化路径为：${targetDir}`)
      );
    });
};
