const program = require("commander");

const commanders = {
  config: require("./config"),
  add: require("./add")
  // create: require("./create"),
  // build: require("./build"),
  // download: require("./download"),
  // update: require("./update")
};

module.exports = version => {
  program
    .version(
      `${require("../package.json").name} ${require("../package.json").version}`
    )
    .usage("exia <command>");

  Object.values(commanders).forEach(commander => commander());

  if (process.argv.length <= 2) {
    program.outputHelp();
  }

  program.parse(process.argv);
};
