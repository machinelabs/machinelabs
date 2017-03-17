import {task, src, dest} from 'gulp';
import * as rename from 'gulp-rename';

const environmentSuffix = process.argv.includes('--staging') ? 'staging' : 'dev';
const environmentConfigPath = `./src/environments/`;
const environmentActiveConfigName = 'environment.ts';

task(`config`, () => {
  return src(`${environmentConfigPath}environment.${environmentSuffix}.ts`)
            .pipe(rename(environmentActiveConfigName))
            .pipe(dest(`${environmentConfigPath}`));
});
