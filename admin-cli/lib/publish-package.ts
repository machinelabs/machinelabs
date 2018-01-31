import { factory } from './execute';

let execute = factory({displayErrors: true});

export const publishPackage = (pathToPackage: string) => {
  let fullPath = process.cwd() + pathToPackage;

  execute(`(cd ${fullPath} && npm publish --access=public)`)
}
