import { Command } from 'commander';

export const initCommand = new Command('init')
  .option('-p, --peppers', 'Add peppers')
  .option('-c, --cheese [type]', 'Add the specified type of cheese', 'marble')
  .option('-C, --no-cheese', 'You do not want any cheese', true)
  .action((options) => {
    console.log(options);
    // console.log('opt', opt);
    // console.log('a', a);
  });
