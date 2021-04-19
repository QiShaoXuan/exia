const path = require("path");
const fs = require("fs-extra");
const inquirer = require("inquirer");
const chalk = require("chalk");
const logSymbols = require("log-symbols");
const program = require("commander");
const minimist = require("minimist");
const cleanArgs = require("../../lib/cleanArgs");
const config = require("../../config.json");

module.exports = async () => {
  program
    .command("add <projectName>")
    .description("添加 react 或 vue 文件")
    .option("-f, --force", "覆盖已存在的目标目录")
    .option("-r, --react", "创建 react 组件的文件夹")
    .option("-v, --vue", "创建 vue 组件的文件夹")
    .action(async (projectName, cmd) => {
      const options = cleanArgs(cmd);
      if (options.vue || config.mode === "vue") {
        return console.log(chalk.yellow("暂不支持创建 vue 组件的文件夹"));
      }

      //名称多于一个英文单词
      if (minimist(process.argv.slice(3))._.length > 1) {
        console.log(
          chalk.yellow(
            "\nYou provided more than one argument. The first one will be used as the app's name, the rest are ignored."
          )
        );
      }
      //开始创建
      const cwd = options.cwd || process.cwd();
      const inCurrent = projectName === ".";
      const targetDir = path.resolve(cwd, projectName || ".");

      if (fs.existsSync(targetDir)) {
        if (options.force) {
          await fs.remove(targetDir);
        } else {
          if (inCurrent) {
            const { ok } = await inquirer.prompt([
              {
                name: "ok",
                type: "confirm",
                message: `Generate project in current directory?`
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
        }
      }

      const rootDir = await require("../../lib/getDir").getCommandRootDir();

      if (options.react || config.mode === "react") {
        const { type } = await inquirer.prompt([
          {
            name: "type",
            type: "list",
            message: `使用组件：`,
            choices: [
              { name: "fn", value: "index-fn.js" },
              { name: "class", value: "index-class.js" }
            ]
          }
        ]);
        const tempDir = path.resolve(rootDir, "./temp/react");

        await fs.copy(tempDir, targetDir).then(() => {
          ["index-fn.js", "index-class.js"].forEach(name => {
            if (name === type) {
              fs.copySync(
                path.resolve(targetDir, name),
                path.resolve(targetDir, "index.js")
              );
            }
            fs.remove(path.resolve(targetDir, name));
          });
        });
      }
      console.log(
        logSymbols.success,
        chalk.green(`创建成功，创建路径为：${targetDir}`)
      );
    });
};
