import { Observable } from 'rxjs/Observable';
import { Resolver } from './resolver';
import { Invocation } from '@machinelabs/models';
import { InternalLabConfiguration } from '../../models/lab-configuration';
import { LabConfigService } from '../../lab-config/lab-config.service';

export class LabConfigResolver implements Resolver {

  constructor(private labConfigService: LabConfigService) {
  }

  resolve(invocation: Invocation) {
    return this.labConfigService.getInternalConfig(invocation.user_id, invocation.data);
  }

}
