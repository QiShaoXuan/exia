const pkgDir = require("pkg-dir");
const path = require("path");
const execa = require("execa");
module.exports = {
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
