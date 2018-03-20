import { ResolvedMap } from '../validation.service';
import { UserResolver } from '../resolver/user-resolver';
import { LabConfigResolver } from '../resolver/lab-config-resolver';
import { InternalLabConfiguration } from '../../models/lab-configuration';
import { ExtendedUser } from '../../models/user';
import { PlanCredits, PlanId } from '@machinelabs/models';

export const LAB_CONFIG_TRANSFORMER = (resolved: ResolvedMap) => {
  const user: ExtendedUser = resolved.get(UserResolver);
  const config: InternalLabConfiguration = resolved.get(LabConfigResolver);
  if (user && config) {
    const userCredits = PlanCredits.get(user.plan.plan_id);

    if (userCredits) {
      config.maxFileUploads = userCredits.maxFileUploads;
      config.maxUploadFileSizeMb = userCredits.maxUploadFileSizeMb;
    }
  }
};
