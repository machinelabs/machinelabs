import { Observable } from '@reactivex/rxjs';
import * as validFilename from 'valid-filename';
import { flatMap, isString, trimStart } from 'lodash';

import { DbRefBuilder } from '@machinelabs/core';
import { MountOption, Mount } from '@machinelabs/models';
import { MountPoint } from '../models/lab-configuration';

const CONTAINER_MOUNT_PREFIX = '/mlmounts';

export interface MountFragments {
  user: string;
  mount: string;
  version: string;
}

export interface ParsedMountOption {
  fragments: MountFragments;
  name: string;
}

export interface ValidatedMount {
  requested: MountOption;
  parsed: ParsedMountOption;
  mountPoint: MountPoint;
  hasErrors: boolean;
  errors: Array<string>;
}

export interface ValidatedMounts {
  validated: Array<ValidatedMount>;
  mountPoints: Array<MountPoint>;
  errors: Array<string>;
  hasErrors: boolean;
}

export class MountService {

  constructor (private rootMountPath: string,
               private db: DbRefBuilder) {}

  getMount(userId: string, mount: string): Observable<Mount> {
    return this.db.mountRef(userId, mount)
                  .onceValue()
                  .map(snapshot => snapshot.val());
  }

  getMountFromOption(mountOption: ParsedMountOption): Observable<Mount> {
    return mountOption ? this.getMount(mountOption.fragments.user, mountOption.fragments.mount) :
                         Observable.of(null);
  }


  userCanAccessMount(userId: string, mount: Mount) {
    return mount && (mount.userId === userId || !mount.private);
  }

  parseMountOption(mountOption: MountOption): ParsedMountOption {
    if (mountOption && isString(mountOption.path)) {

      let fragements = trimStart(mountOption.path, '/').split('/');

      if (fragements.length == 2) {
        return {
          fragments: {
            user: fragements[0],
            mount: fragements[1],
            version: null,
          },
          name: mountOption.name
        };
      } else if (fragements.length === 3) {
        return {
          fragments: {
            user: fragements[0],
            mount: fragements[1],
            version: fragements[2],
          },
          name: mountOption.name
        };
      }
    }

    return null;
  }

  toMountPoint (option: ParsedMountOption) {
    return {
      source: `${this.rootMountPath}/mounts/${option.fragments.user}/${option.fragments.mount}/${option.fragments.version}`,
      destination: `${CONTAINER_MOUNT_PREFIX}/${option.name}`
    };
  }

  validateMounts(userId: string, requestedMounts: Array<MountOption>): Observable<ValidatedMounts> {
    let parsedMounts = requestedMounts.map(mount => this.parseMountOption(mount));

    if (!requestedMounts.length) {
      return Observable.of({
        validated: [],
        mountPoints: [],
        errors: [],
        hasErrors: false
      });
    }

    let mounts$ = parsedMounts.map(parsedOption => this.getMountFromOption(parsedOption));

    return Observable.forkJoin(mounts$)
                     .map(mounts => {

                       let validated = mounts.map((mount, index) => this.toValidatedMount(userId, requestedMounts[index], parsedMounts[index], mount));
                       let mountPoints = validated.map(val => val.mountPoint);
                       let parsed = parsedMounts;
                       let errors = flatMap(validated, val => val.errors);
                       let hasErrors = errors.length === 0;

                       return {
                         validated: validated,
                         mountPoints: mountPoints,
                         errors: errors,
                         hasErrors: hasErrors
                       };
                     });
  }

  toValidatedMount(userId: string, requested: MountOption, parsed: ParsedMountOption, mount: Mount): ValidatedMount {

    parsed.fragments.version = parsed.fragments.version === null ? mount.latest_version : parsed.fragments.version;

    let exists = !!mount;
    let versionExists = mount && ((parsed.fragments.version) in mount.versions);
    let accessible = this.userCanAccessMount(userId, mount);
    let validName = validFilename(requested.name);
    let errors = [];

    if (!exists) {
      errors.push(`Can not mount ${requested.path}. Mount does not exist.`);
    }

    if (!versionExists) {
      errors.push(`Can not mount ${requested.path}. Version does not exist.`);
    }

    if (!validName) {
      errors.push(`Can not mount at ${requested.name}. Invalid name.`);
    }

    if (!accessible) {
      errors.push(`Can not mount ${requested.path}. The requested mount isn't public`);
    }

    return {
      requested: requested,
      parsed: parsed,
      mountPoint: parsed ? this.toMountPoint(parsed) : null,
      errors: errors,
      hasErrors: errors.length === 0
    };
  }
}
