import { DummyRunner } from './code-runner/dummy-runner.js';
import { DockerRunner } from './code-runner/docker-runner.js';
import { MessagingService } from './messaging.service';
import { ValidationService } from './validation/validation.service';
import { environment } from './environments/environment';
import { DockerImageService, getDockerImages } from './docker-image.service';
import { HasPlanRule } from './validation/rules/has-plan';
import { NoAnonymousRule } from './validation/rules/no-anonymous';
import { HasValidConfigRule } from './validation/rules/has-valid-config';
import { LabConfigService } from './lab-config/lab-config.service';
import { UserResolver } from './validation/resolver/user-resolver';
import { LabConfigResolver } from './validation/resolver/lab-config-resolver';
import { ExecutionResolver } from './validation/resolver/execution-resolver';
import { OwnsExecutionRule } from './validation/rules/owns-execution';

console.log(`Starting MachineLabs server (${environment.serverId})`)

const labConfigService = new LabConfigService;
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
      .addRule(new HasValidConfigRule())
      .addResolver(UserResolver, new UserResolver())
      .addResolver(LabConfigResolver, new LabConfigResolver(dockerImageService, labConfigService));

    const stopValidationService = new ValidationService();
    stopValidationService
      .addRule(new OwnsExecutionRule())
      .addResolver(ExecutionResolver, new ExecutionResolver());

    const messagingService = new MessagingService(validationService, stopValidationService, runner);
    messagingService.init();

    console.log(`Using runner: ${runner.constructor.name}`);
    console.log(`machinelabs server running (${environment.serverId})`);
  });


