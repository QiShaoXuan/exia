export interface IConfig {
  remoteConfigUrl: string;
  isDebug: boolean;
  rootName: string;
  remoteTemplateGroupUrl: string;
}

export { getConfig } from './getConfig';

export { defaultConfig } from './defaultConfig';
