import * as fs from 'fs';

export function isRootDir() {
  return fs.existsSync('admin-cli') && fs.existsSync('server');
}
