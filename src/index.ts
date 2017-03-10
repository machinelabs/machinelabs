import * as io_lib from 'socket.io';

import { DummyRunner } from './code-runner/dummy-runner.js';
import { DockerRunner } from './code-runner/docker-runner.js';
import { AuthService } from './fb';
import { MessagingService } from './messaging.service';

const io = io_lib();
const DUMMY_RUNNER = process.argv.includes('--dummy-runner');
let runner = DUMMY_RUNNER ? new DummyRunner() : new DockerRunner();

const authService = new AuthService();
const messagingService = new MessagingService(authService, runner);
messagingService.init();

console.log(`Using runner: ${runner.constructor.name}`);
console.log(`machinelabs server running`);