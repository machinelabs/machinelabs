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
    const planId = !user.plan ? PlanId.None : user.plan.plan_id;
    const userCredits = PlanCredits.get(planId);

    if (userCredits) {
      config.maxFileUploads = userCredits.maxFileUploads;
      config.maxUploadFileSizeMb = userCredits.maxUploadFileSizeMb;
    }
  }
};
