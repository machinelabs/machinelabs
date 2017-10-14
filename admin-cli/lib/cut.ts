import * as process from 'process';

import * as chalk from 'chalk';
import * as moment from 'moment';
import * as semver from 'semver';

import { factory } from './execute';
import { isRootDir } from './is-root-dir';
import { incVersion } from './inc-version';
import { getCurrentVersion } from './get-version';
import { failWith } from './fail-with';

let execute = factory({displayErrors: true});


export function cut (versionOrType, dryRun) {
  if (!isRootDir()) {
    failWith('Command needs to be run from root dir');
  }

  let buildnumber = moment().utc().format('utc.YYYY.MMM.DD-H.mm.ss');

  let newVersion;
  if (versionOrType === 'major' || versionOrType === 'minor' || versionOrType === 'patch') {
    newVersion = incVersion(versionOrType);
  } else if (versionOrType === 'dev') {
    // A dev build has the current version number with a dev appended
    // If the current release was already a dev release we make sure
    // to not double append the -dev suffix
    newVersion = `${getCurrentVersion()}-dev`.replace('-dev-dev', '-dev');
  } else {
    newVersion = versionOrType;
  }

  let versionWithBuild = `${newVersion}+${buildnumber}`;

  // Dev versions don't increase so it's crucial to have the build number
  // in the tag to not have conflicting tag names
  let tagVersion = versionOrType === 'dev' ? versionWithBuild : newVersion;

  console.log(chalk.green(`New version will be ${versionWithBuild}`));

  if (dryRun) {
    console.log(chalk.green(`Dry run...stopping`));
    process.exit(0);
  }

  let yarnVersionCmd = `yarn version --no-git-tag-version --new-version ${versionWithBuild}`;

  execute(`(cd ./server && ${yarnVersionCmd}) &&
           (cd ./shared/core && ${yarnVersionCmd}) &&
           (cd ./shared/metrics && ${yarnVersionCmd}) &&
           (cd ./shared/models && ${yarnVersionCmd}) &&
           (cd ./server && yarn upgrade @machinelabs/core) &&
           (cd ./client && ${yarnVersionCmd}) &&
           (cd ./firebase/functions && ${yarnVersionCmd}) &&
           
           (cd ./admin-cli && ${yarnVersionCmd})`);


  execute(`git add -A &&
           git commit -m "chore(package.json): cutting version ${tagVersion}" &&
           git tag -a ${tagVersion} -m "chore: tagging ${versionWithBuild}"`);
}
