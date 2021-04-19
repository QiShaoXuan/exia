const pkgDir = require("pkg-dir");
const path = require("path");
const execa = require("execa");
module.exports = {
  // 获取指令所在文件最近的含有 package.json 的文件路径
  // npm 包的安装目录
  getCommandRootDir: async function() {
    const commandDir = await pkgDir(__dirname);
    return commandDir;
  },
  getTemplateDir: async function() {
    const { stdout: globalDir } = await execa("npm", [
      "config",
      "get",
      "prefix"
    ]);
    return path.resolve(globalDir, "./lib/node_modules/@elf/template");
  },
  getCurrentRootDir: async function() {
    return await pkgDir(process.cwd());
  }
};
