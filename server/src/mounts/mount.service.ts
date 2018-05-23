import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import * as validFilename from 'valid-filename';
import { flatMap, isString, trimStart } from 'lodash';

import { DbRefBuilder } from '@machinelabs/core';
import { MountOption, Mount } from '@machinelabs/models';
import { MountPoint } from '../models/lab-configuration';

const CONTAINER_MOUNT_PREFIX = '/machinelabs/mounts';

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
  constructor(private rootMountPath: string, private db: DbRefBuilder) {}

  getMount(userId: string, mount: string): Observable<Mount> {
    return this.db
      .mountRef(userId, mount)
      .onceValue()
      .pipe(map(snapshot => snapshot.val()));
  }

  getMountFromOption(mountOption: ParsedMountOption): Observable<Mount> {
    return mountOption ? this.getMount(mountOption.fragments.user, mountOption.fragments.mount) : of(null);
  }

  userCanAccessMount(userId: string, mount: Mount) {
    return mount && (mount.userId === userId || !mount.private);
  }

  parseMountOption(mountOption: MountOption): ParsedMountOption {
    if (mountOption && isString(mountOption.path)) {
      const fragements = trimStart(mountOption.path, '/').split('/');

      if (fragements.length == 2) {
        return {
          fragments: {
            user: fragements[0],
            mount: fragements[1],
            version: null
          },
          name: mountOption.name
        };
      } else if (fragements.length === 3) {
        return {
          fragments: {
            user: fragements[0],
            mount: fragements[1],
            version: fragements[2]
          },
          name: mountOption.name
        };
      }
    }

    return null;
  }

  toMountPoint(option: ParsedMountOption) {
    return {
      source: `${this.rootMountPath}/mounts/${option.fragments.user}/${option.fragments.mount}/${
        option.fragments.version
      }`,
      destination: `${CONTAINER_MOUNT_PREFIX}/${option.name}`
    };
  }

  validateMounts(userId: string, requestedMounts: Array<MountOption>): Observable<ValidatedMounts> {
    const parsedMounts = requestedMounts.map(mount => this.parseMountOption(mount));

    if (!requestedMounts.length) {
      return of({
        validated: [],
        mountPoints: [],
        errors: [],
        hasErrors: false
      });
    }

    const mounts$ = parsedMounts.map(parsedOption => this.getMountFromOption(parsedOption));

    return forkJoin(mounts$).pipe(
      map(mounts => {
        const validated = mounts.map((mount, index) =>
          this.toValidatedMount(userId, requestedMounts[index], parsedMounts[index], mount)
        );
        const mountPoints = validated.map(val => val.mountPoint);
        const parsed = parsedMounts;
        const errors = flatMap(validated, val => val.errors);
        const hasErrors = errors.length === 0;

        return {
          validated: validated,
          mountPoints: mountPoints,
          errors: errors,
          hasErrors: hasErrors
        };
      })
    );
  }

  toValidatedMount(userId: string, requested: MountOption, parsed: ParsedMountOption, mount: Mount): ValidatedMount {
    parsed.fragments.version = parsed.fragments.version === null ? mount.latest_version : parsed.fragments.version;

    const exists = !!mount;
    const versionExists = mount && parsed.fragments.version in mount.versions;
    const accessible = this.userCanAccessMount(userId, mount);
    const validName = validFilename(requested.name);
    const errors = [];

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
