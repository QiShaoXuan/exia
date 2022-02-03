export type IRC = {
  beforeAllAction?: (
    commandInfo: { name: string; options: { [key: string]: any } },
    Core: any,
  ) => void;
  afterAllAction?: (
    commandInfo: { name: string; options: { [key: string]: any } },
    Core: any,
  ) => void;
};

export { defaultRC } from './defaultRC';

export { getRC } from './getRC';
