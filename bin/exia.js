#!/usr/bin/env node
const chalk = require("chalk");
const commanders = require("../commanders/index.js");
const figlet = require("figlet");

async function checkCliVersion() {
  try {
    console.log(figlet.textSync("-- EXIA --"));
  } catch (e) {}

  commanders();
}

checkCliVersion().catch(e => {
  console.log(chalk.red("初始化失败"));
  console.log(e);
  process.exit(1);
});
