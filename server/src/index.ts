import { DummyRunner } from './code-runner/dummy-runner.js';
import { DockerRunner } from './code-runner/docker-runner.js';
import { MessagingService } from './messaging.service';
import { RulesService } from './rules.service';

const DUMMY_RUNNER = process.argv.includes('--dummy-runner');
let runner = DUMMY_RUNNER ? new DummyRunner() : new DockerRunner();

const rulesService = new RulesService();
const messagingService = new MessagingService(rulesService, runner);
messagingService.init();

console.log(`Using runner: ${runner.constructor.name}`);
console.log(`machinelabs server running`);