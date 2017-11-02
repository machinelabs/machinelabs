import { LabDirectory, Directory, File } from '@machinelabs/models';

export const parseLabDirectory = (labDirectory: LabDirectory | string) => {
  let dir = typeof labDirectory === 'string' ? JSON.parse(labDirectory) : labDirectory;
  return Array.isArray(dir) ? dir : [];
};

