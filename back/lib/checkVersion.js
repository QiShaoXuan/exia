const execa = require("execa");
const logSymbols = require("log-symbols");
const chalk = require("chalk");
const packageId = require("../package.json").name;
const semver = require("semver");
const ora = require("ora");


// 检查 node 版本
function checkNodeVersion() {
  const wanted = require("../package").engines.node;

  if (!semver.satisfies(process.version, wanted)) {
    console.log(
      chalk.red(
        `You are using Node ${process.version}, but this version of @elf/cli requires Node ${wanted}.\nPlease upgrade your Node version.`
      )
    );
    process.exit(1);
  } else {
    console.log(logSymbols.success, chalk.green(`Check node version end.`));
  }
}

//检查 exia 版本
async function checkExiaVersion() {
  const { stdout: cliVersion } = await execa("npm", [
    "view",
    packageId,
    "version"
  ]);

  if (cliVersion !== require("../package").version) {
    console.log(chalk.yellow(`${packageId} 版本与线上不同`));

    const spinner = ora({ text: `开始更新 ${packageId}` }).start();
    await execa("npm", ["install", packageId, "-g"]);
    spinner.stop();
  } else {
    console.log(
      logSymbols.success,
      chalk.green(`Check ${packageId} version end.`)
    );
  }
}

module.exports = {
  checkNodeVersion,
  checkExiaVersion
};
