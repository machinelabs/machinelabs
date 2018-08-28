import { getMlYamlFromPath } from './read-fs';
import { parseMlYaml } from './parse';
import { LabConfig } from '@machinelabs/models';

export const parseMlYamlFromPath = (path: string) => parseMlYaml(getMlYamlFromPath(path));
