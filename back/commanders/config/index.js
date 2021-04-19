const fs = require("fs-extra");
const inquirer = require("inquirer");
const chalk = require("chalk");
const program = require("commander");

module.exports = async () => {
  program
    .command("config")
    .description("定制常用的配置，每次安装后需重新配置")
    .action(async () => {
      const newConfig = await inquirer.prompt([
        {
          name: "mode",
          type: "list",
          message: "常用框架为：",
          choices: [
            { name: "react", value: "react" },
            { name: "vue", value: "vue" }
          ]
        },
        {
          name: "alwaysPath",
          type: "input",
          message:
            "常用路径为（默认以指令当前路径执行，设置应为以最近 package.json 所在路径的相对路径）",
          default: ""
        }
      ]);

      const originConfig = require("../../config.json");
      const rootPath = await require("../../lib/getDir").getCommandRootDir();
      const beautify = require("js-beautify").js;
      const config = beautify(
        JSON.stringify(Object.assign(originConfig, newConfig)),
        {
          indent_size: 2,
          space_in_empty_paren: false
        }
      );

      fs.outputFile(`${rootPath}/config.json`, config);

      console.log(chalk.green("修改成功，当前配置为："));
      console.log(config);
    });
};
