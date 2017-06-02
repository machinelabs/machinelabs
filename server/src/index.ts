import { DummyRunner } from './code-runner/dummy-runner.js';
import { DockerRunner } from './code-runner/docker-runner.js';
import { MessagingService } from './messaging.service';
import { ValidationService } from './validation/validation.service';
import { environment } from './environments/environment';
import { DockerImageService, getDockerImages } from './docker-image.service';
import { HasPlanRule } from './validation/rules/has-plan';
import { NoAnonymousRule } from './validation/rules/no-anonymous';
import { HasValidConfigRule } from './validation/rules/has-valid-config';

console.log(`Starting MachineLabs server (${environment.serverId})`)

const dockerImageService = new DockerImageService(getDockerImages());

dockerImageService
  .init()
  .subscribe(_ => {
    const DUMMY_RUNNER = process.argv.includes('--dummy-runner');
    let runner = DUMMY_RUNNER ? new DummyRunner() : new DockerRunner();

    const validationService = new ValidationService();
    validationService
      .addRule(new HasPlanRule())
      .addRule(new NoAnonymousRule())
      .addRule(new HasValidConfigRule(dockerImageService));

    const messagingService = new MessagingService(validationService, runner);
    messagingService.init();

    console.log(`Using runner: ${runner.constructor.name}`);
    console.log(`machinelabs server running (${environment.serverId})`);
  });


