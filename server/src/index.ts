import { DummyRunner } from './code-runner/dummy-runner.js';
import { DockerRunner } from './code-runner/docker-runner.js';
import { MessagingService } from './messaging/messaging.service';
import { RecycleService } from './messaging/recycling/recycle.service';
import { MessageRepository } from './messaging/message-repository';
import { ValidationService } from './validation/validation.service';
import { UsageStatisticService } from '@machinelabs/metrics';
import { environment } from './environments/environment';
import { DockerImageService, getDockerImages } from './docker-image.service';
import { HasPlanRule } from './validation/rules/has-plan';
import { NoAnonymousRule } from './validation/rules/no-anonymous';
import { HasValidConfigRule } from './validation/rules/has-valid-config';
import { HasCreditsLeftRule } from './validation/rules/has-credits-left';
import { ServerHasCapacityRule } from './validation/rules/server-has-capacity';
import { LabConfigService } from './lab-config/lab-config.service';
import { UserResolver } from './validation/resolver/user-resolver';
import { LabConfigResolver } from './validation/resolver/lab-config-resolver';
import { ExecutionResolver } from './validation/resolver/execution-resolver';
import { OwnsExecutionRule } from './validation/rules/owns-execution';
import { WithinConcurrencyLimit } from './validation/rules/within-concurrency-limit';
import { UsageStatisticResolver } from './validation/resolver/usage-statistic-resolver';
import { CostCalculator } from '@machinelabs/metrics';
import { dbRefBuilder } from './ml-firebase';
import { replaceConsole } from './logging';
import { DockerFileUploader } from './code-runner/uploader/docker-file-uploader';
import { DockerFileDownloader } from './code-runner/downloader/docker-file-downloader';
import { spawn, spawnShell } from '@machinelabs/core';
import { MountService } from './mounts/mount.service';
const { version } = require('../package.json');

replaceConsole();

console.log(`Starting MachineLabs server (${environment.serverId})`);

const mountService = new MountService(environment.rootMountPath, dbRefBuilder);
const dockerImageService = new DockerImageService(getDockerImages());
const labConfigService = new LabConfigService(dockerImageService, mountService);
const usageStatisticService = new UsageStatisticService(new CostCalculator(), <any>dbRefBuilder);
const recycleService = new RecycleService({
  messageRepository: new MessageRepository(),
  getMessageTimeout: 5000,
  triggerIndex: 7000,
  triggerIndexStep: 100,
  tailLength: 6000,
  deleteCount: 5000
});

const uploader = new DockerFileUploader(50, 5);
const downloader = new DockerFileDownloader(spawn);

dockerImageService
  .init()
  .subscribe(_ => {
    const DUMMY_RUNNER = process.argv.includes('--dummy-runner');
    let runner = DUMMY_RUNNER ? new DummyRunner() : new DockerRunner(spawn, spawnShell, uploader, downloader);

    const validationService = new ValidationService();
    validationService
      .addRule(new NoAnonymousRule())
      .addRule(new HasPlanRule())
      .addRule(new HasValidConfigRule(labConfigService))
      .addRule(new HasCreditsLeftRule())
      .addRule(new WithinConcurrencyLimit())
      .addRule(new ServerHasCapacityRule(runner))
      .addResolver(UserResolver, new UserResolver())
      .addResolver(LabConfigResolver, new LabConfigResolver(labConfigService))
      .addResolver(UsageStatisticResolver, new UsageStatisticResolver(usageStatisticService));

    const stopValidationService = new ValidationService();
    stopValidationService
      .addRule(new OwnsExecutionRule())
      .addResolver(ExecutionResolver, new ExecutionResolver());

    const messagingService = new MessagingService(validationService, stopValidationService, recycleService, runner);
    messagingService.init();

    console.log(`Using runner: ${runner.constructor.name}`);
    console.log(`MachineLabs server running (${environment.serverId} on v${version})`);
  });
