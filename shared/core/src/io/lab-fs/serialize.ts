import { LabDirectory, Directory, File } from '@machinelabs/models';

export const stringifyDirectory = (dir: LabDirectory) =>
  JSON.stringify(dir, (key, value) => (key === 'clientState' ? undefined : value));
