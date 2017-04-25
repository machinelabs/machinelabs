import {join} from 'path';

export const PROJECT_ROOT = join(__dirname, '../..');
export const SOURCE_ROOT = join(PROJECT_ROOT, 'src');
export const TEST_ROOT = join(PROJECT_ROOT, 'test');

export const DIST_ROOT = join(PROJECT_ROOT, 'dist');
export const DIST_COMPONENTS_ROOT = join(DIST_ROOT, '@thoughtram/machinelabs-server');

// Useful to build deployed files directly to /node_modules/
export const DIST_NODE_MODULES = join(PROJECT_ROOT, `node_modules/${DIST_COMPONENTS_ROOT}`);


export const NPM_VENDOR_FILES = [
  'rxjs'
];
