import commander, { Command } from 'commander';

import { initCommand, devCommand } from './commanders';
import { getConfig, IConfig } from './config';
import { getRC, IRC } from './rc';
import { getUserInfo, IUserInfo } from './userInfo';

class Core {
  config: IConfig;
  RC: IRC;
  userInfo: IUserInfo;
  program: commander.Command;
  constructor() {
    this.config = getConfig();
    this.userInfo = getUserInfo();
    this.RC = getRC();
    this.program = new Command();
  }

  exec() {
    [initCommand, devCommand].forEach((customCommander) => {
      const name = customCommander.name();
      const options = customCommander.opts();

      customCommander.hook('preAction', () => {
        this.beforeAction(name, options);
        this.RC?.beforeAllAction?.({ name, options }, this);
      });

      customCommander.hook('preAction', () => {
        this.afterAction(name, options);
        this.RC?.afterAllAction?.({ name, options }, this);
      });

      this.program.addCommand(customCommander);
    });

    this.program.parse();
  }

  beforeAction(commandName: string, options: { [key: string]: any }) {}

  afterAction(commandName: string, options: { [key: string]: any }) {}
}

export default new Core();
