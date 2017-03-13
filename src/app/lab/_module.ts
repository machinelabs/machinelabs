import {NgModule, Provider} from '@angular/core';

import {LabResolver} from './services/lab.resolver';
import {LabStorageService} from './services/lab-storage.service';
import {RemoteLabExecService} from './services/remote-lab-exec.service';
import {LabTemplateService, InMemoryLabTemplateService} from './services/lab-template.service';

/**
 * Exported set of Lab service providers
 */
const LAB_PROVIDERS = [
  RemoteLabExecService,
  LabStorageService,
  LabResolver,
  {
    provide: LabTemplateService,
    useClass: InMemoryLabTemplateService
  },
];
/**
 * Root module for the MachineLabs Client
 */
@NgModule({
  imports: [ ],
  providers : [
    LAB_PROVIDERS
  ]
})
export class LabModule {
  static forRoot() : Provider[]  {
    return LAB_PROVIDERS;
  }
}
