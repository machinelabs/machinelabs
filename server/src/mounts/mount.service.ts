import { Observable } from '@reactivex/rxjs';
import * as validFilename from 'valid-filename';
import { flatMap } from 'lodash';

import { MountOption, Dataset } from '@machinelabs/models';
import { MountPoint } from 'src/models/lab-configuration';
import { DatasetService } from 'src/dataset.service';

const CONTAINER_MOUNT_PREFIX = '/mlmounts';

export interface ValidatedMount {
  exists: boolean;
  versionExists: boolean;
  accessible: boolean;
  validMountName: boolean;
  mountOption: MountOption;
  dataset: Dataset;
  mountPoint: MountPoint;
  errors: Array<string>;
}

export class MountService {

  constructor (private rootMountPath: string,
               private datasetService: DatasetService) {}

  public toDatasetMountPoint (mount: MountOption) {
    return {
      source: `${this.rootMountPath}/datasets/${mount.user}/${mount.dataset}/${mount.version}`,
      destination: `${CONTAINER_MOUNT_PREFIX}/${mount.mountName}`
    };
  }

  private canBeMounted(validatedMount: any) {
    return validatedMount.exists &&
           validatedMount.versionExists &&
           validatedMount.accessible &&
           validatedMount.validMountName;
  }

  public validateMounts(userId: string, requestedMounts: Array<MountOption>) {
    return Observable.forkJoin(requestedMounts.map(mount => this.datasetService.getDataset(mount.user, mount.dataset)))
              .map(sets => sets.map((ds, index) => {
                let requestedMount = requestedMounts[index];
                let validatedMount = {
                  exists: !!ds,
                  versionExists: ds && requestedMount.version in ds.versions,
                  accessible: this.datasetService.userCanAccessDataset(userId, ds),
                  errors: [] as Array<string>,
                  validMountName: validFilename(requestedMount.mountName),
                  mountOption: requestedMount,
                  dataset: ds,
                  mountPoint: this.toDatasetMountPoint(requestedMount)
                };

                this.addErrors(validatedMount);

                return validatedMount;
              }));
  }


  private addErrors(validatedMount: ValidatedMount) {
    let mountString = `${validatedMount.mountOption.user}/${validatedMount.mountOption.dataset}/${validatedMount.mountOption.version}`;

    if (!validatedMount.exists) {
      validatedMount.errors.push(`Can not mount ${mountString}. Dataset does not exist.`);
    }

    if (!validatedMount.versionExists) {
      validatedMount.errors.push(`Can not mount ${mountString}. Version does not exist.`);
    }

    if (!validatedMount.validMountName) {
      validatedMount.errors.push(`Can not mount at ${validatedMount.mountOption.mountName}. Invalid name.`);
    }

    if (!validatedMount.accessible) {
      validatedMount.errors.push(`Can not mount ${mountString}. The requested dataset isn't public`);
    }
  }

  public extractValidMountPoints(validatedMounts: Array<ValidatedMount>) {
    return validatedMounts.filter(this.canBeMounted)
                          .map(val => val.mountPoint);
  }

  public extractErrors(validatedMounts: Array<ValidatedMount>) {
    return flatMap(validatedMounts, val => val.errors);
  }
}
