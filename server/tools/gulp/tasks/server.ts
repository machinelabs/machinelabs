import {task} from 'gulp';
import {SOURCE_ROOT, TEST_ROOT } from '../constants';
import { tsBuildTask } from '../task_helpers';


// PUBLIC tasks

/** Builds server to ESM output and UMD bundle. */

task('build', ['clean', 'config', ':build:server:ts']);

// INTERNAL tasks
/**
 * Builds server typescript only (ESM output).
 */
task(':build:server:ts', tsBuildTask(SOURCE_ROOT, 'tsconfig.json'));


/** Builds server typescript for tests (with CommonJS output). */
task(':build:server:spec', tsBuildTask(TEST_ROOT, 'tsconfig-spec.json'));

