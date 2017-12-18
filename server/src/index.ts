import { Observable } from '@reactivex/rxjs';
import { DummyRunner } from './code-runner/dummy-runner.js';
import { DockerRunner } from './code-runner/docker-runner.js';
import { MessagingService } from './messaging/messaging.service';
import { RecycleService } from './messaging/recycling/recycle.service';
import { MessageRepository } from './messaging/message-repository';
import { ValidationService } from './validation/validation.service';
import { UsageStatisticService, LiveMetricsService } from '@machinelabs/metrics';
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
import { CanUseHardwareType } from './validation/rules/can-use-hardware-type';
import { CostReportResolver } from './validation/resolver/usage-statistic-resolver';
import { CostCalculator } from '@machinelabs/metrics';
import { dbRefBuilder } from './ml-firebase';
import { replaceConsole } from './logging';
import { DockerFileUploader } from './code-runner/uploader/docker-file-uploader';
import { DockerFileDownloader } from './code-runner/downloader/docker-file-downloader';
import { spawn, spawnShell } from '@machinelabs/core';
import { MountService } from './mounts/mount.service';
import { DockerAvailabilityChecker, DockerExecutable } from './code-runner/docker-availability-checker';

const { version } = require('../package.json');

replaceConsole();

console.log(`Starting MachineLabs server (${environment.serverId})`);

const dockerAvailabilityChecker = new DockerAvailabilityChecker(spawn);
const mountService = new MountService(environment.rootMountPath, dbRefBuilder);
const dockerImageService = new DockerImageService(getDockerImages(), spawnShell);
const labConfigService = new LabConfigService(dockerImageService, mountService);
const liveMetricsService = new LiveMetricsService(<any>dbRefBuilder);
const usageStatisticService = new UsageStatisticService(new CostCalculator(), liveMetricsService, <any>dbRefBuilder);
const recycleService = new RecycleService({
  messageRepository: new MessageRepository(),
  getMessageTimeout: 5000,
  triggerIndex: 5000,
  triggerIndexStep: 1000,
  tailLength: 4000,
  deleteCount: 3000
});

const uploader = new DockerFileUploader(50, 5);
const downloader = new DockerFileDownloader(spawn);

let initActions = [dockerImageService.init(), dockerAvailabilityChecker.getExecutable()];

if (environment['pullImages']) {
  console.log('Pulling docker images...hold on');
  initActions = [dockerImageService.pullImages(), ...initActions];
} else {
  console.log('Not pulling docker images');
}

Observable
  .forkJoin(initActions)
  .map(results => results[results.length - 1])
  .subscribe(dockerBinary => {
    const DUMMY_RUNNER = process.argv.includes('--dummy-runner') || dockerBinary === DockerExecutable.None;
    let runner = DUMMY_RUNNER ? new DummyRunner() : new DockerRunner(dockerBinary, spawn, spawnShell, uploader, downloader);

    const validationService = new ValidationService();
    validationService
      .addRule(new NoAnonymousRule())
      .addRule(new HasPlanRule())
      .addRule(new HasValidConfigRule(labConfigService))
      .addRule(new CanUseHardwareType())
      .addRule(new HasCreditsLeftRule(usageStatisticService))
      .addRule(new WithinConcurrencyLimit())
      .addRule(new ServerHasCapacityRule(runner))
      .addResolver(UserResolver, new UserResolver())
      .addResolver(LabConfigResolver, new LabConfigResolver(labConfigService))
      .addResolver(CostReportResolver, new CostReportResolver(usageStatisticService));

    const stopValidationService = new ValidationService();
    stopValidationService
      .addRule(new OwnsExecutionRule())
      .addResolver(ExecutionResolver, new ExecutionResolver());

    const messagingService = new MessagingService(validationService, stopValidationService, recycleService, runner);
    messagingService.init();

    console.log(`Using runner: ${runner.constructor.name}`);
    console.log(`MachineLabs server running (${environment.serverId} on v${version})`);
  });
