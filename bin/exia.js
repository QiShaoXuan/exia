#!/usr/bin/env node
const chalk = require("chalk");
const commanders = require("../commanders/index.js");
const figlet = require("figlet");

async function runCommanders() {
  try {
    console.log(figlet.textSync("-- EXIA --"));
  } catch (e) {}
  commanders();
}

runCommanders().catch(e => {
  console.log(chalk.red("初始化失败"));
  console.log(chalk.yellow("检查版本："));
  Promise.all([
    require("../lib/checkVersion").checkNodeVersion(),
    require("../lib/checkVersion").checkExiaVersion()
  ]).then(() => {
    console.log(chalk.red("报错信息："));
    console.log(e);

    process.exit(1);
  });
});
