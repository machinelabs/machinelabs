import { getMlYamlFromPath } from './read-fs';
import { parseMlYaml } from './parse';

export const parseMlYamlFromPath = (path: string) => parseMlYaml(getMlYamlFromPath(path));
